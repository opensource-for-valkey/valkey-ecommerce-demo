import os
import io
import json
import numpy as np
import soundfile as sf
import torch

# Fix for Windows OpenMP conflict with anaconda
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import subprocess
import tempfile

from valkey_client import r

ENROLL_KEY = "voice:embedding:{user_id}"
MIN_DURATION_SECONDS = 3.0
VERIFY_THRESHOLD = 0.55   # your voice ~0.67, different voice ~0.40 — threshold sits in between

_encoder = None

def _get_encoder():
    """Lazy-load SpeechBrain ECAPA-TDNN — downloads once on first call."""
    global _encoder
    if _encoder is None:
        try:
            from speechbrain.inference.classifiers import EncoderClassifier
        except ImportError:
            from speechbrain.pretrained import EncoderClassifier
        _encoder = EncoderClassifier.from_hparams(
            source="speechbrain/spkrec-ecapa-voxceleb",
            savedir="pretrained_models/spkrec-ecapa-voxceleb",
            run_opts={"device": "cpu"},
        )
    return _encoder


def _load_audio(audio_bytes: bytes, target_sr: int = 16000) -> torch.Tensor:
    """Load audio bytes → 16kHz mono float32 tensor.

    soundfile handles WAV/FLAC/OGG.
    Browsers send WebM/Opus — converted via imageio-ffmpeg subprocess call.
    """
    import librosa

    # Fast path: soundfile handles WAV directly (used by test scripts)
    try:
        audio, sr = sf.read(io.BytesIO(audio_bytes))
        if audio.ndim > 1:
            audio = audio.mean(axis=1)
        audio = audio.astype(np.float32)
        if sr != target_sr:
            audio = librosa.resample(audio, orig_sr=sr, target_sr=target_sr)
        return torch.tensor(audio).unsqueeze(0)
    except Exception:
        pass

    # Browser path: WebM/Opus → WAV via explicit ffmpeg binary
    import imageio_ffmpeg
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

    tmp_in = tempfile.NamedTemporaryFile(suffix=".webm", delete=False)
    tmp_out_path = tmp_in.name.replace(".webm", ".wav")
    try:
        tmp_in.write(audio_bytes)
        tmp_in.close()

        subprocess.run(
            [ffmpeg_exe, "-y", "-i", tmp_in.name,
             "-ar", str(target_sr), "-ac", "1", tmp_out_path],
            check=True,
            capture_output=True,
        )

        audio, _ = sf.read(tmp_out_path)
        audio = audio.astype(np.float32)
        return torch.tensor(audio).unsqueeze(0)

    finally:
        for p in [tmp_in.name, tmp_out_path]:
            try:
                os.unlink(p)
            except OSError:
                pass


def _extract_embedding(audio_tensor: torch.Tensor) -> np.ndarray:
    """Run ECAPA-TDNN → 192D speaker embedding."""
    encoder = _get_encoder()
    with torch.no_grad():
        embedding = encoder.encode_batch(audio_tensor)  # (1, 1, 192)
    vec = embedding.squeeze().numpy()
    return (vec / (np.linalg.norm(vec) + 1e-8)).astype(np.float32)


def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8))


def enroll_voice(audio_bytes: bytes, user_id: str) -> dict:
    try:
        audio_tensor = _load_audio(audio_bytes)
    except Exception as e:
        return {"status": "error", "message": f"Could not read audio: {e}"}

    duration = audio_tensor.shape[1] / 16000
    if duration < MIN_DURATION_SECONDS:
        return {
            "status": "error",
            "message": f"Audio too short. Please speak for at least {int(MIN_DURATION_SECONDS)} seconds.",
        }

    try:
        embedding = _extract_embedding(audio_tensor)
    except Exception as e:
        return {"status": "error", "message": f"Model inference failed: {e}"}

    key = ENROLL_KEY.format(user_id=user_id)
    r.set(key, json.dumps(embedding.tolist()))

    return {
        "status": "enrolled",
        "user_id": user_id,
        "message": "Voice registered successfully",
    }


def verify_voice(audio_bytes: bytes, user_id: str) -> dict:
    key = ENROLL_KEY.format(user_id=user_id)
    stored = r.get(key)
    if not stored:
        return {"verified": False, "score": 0.0, "message": "User not enrolled"}

    stored_embedding = np.array(json.loads(stored), dtype=np.float32)

    try:
        audio_tensor = _load_audio(audio_bytes)
    except Exception as e:
        return {"verified": False, "score": 0.0, "message": f"Could not read audio: {e}"}

    try:
        embedding = _extract_embedding(audio_tensor)
    except Exception as e:
        return {"verified": False, "score": 0.0, "message": f"Model inference failed: {e}"}

    score = _cosine_similarity(embedding, stored_embedding)
    verified = score >= VERIFY_THRESHOLD

    return {
        "verified": verified,
        "score": round(score, 4),
        "message": "Voice verified" if verified else "Voice not recognised",
    }


def check_enrollment_status(user_id: str) -> dict:
    key = ENROLL_KEY.format(user_id=user_id)
    enrolled = r.exists(key) == 1
    return {"enrolled": enrolled, "user_id": user_id}
