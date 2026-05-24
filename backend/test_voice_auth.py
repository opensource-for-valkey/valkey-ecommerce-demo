import requests
import sounddevice as sd
import soundfile as sf
import numpy as np
import io

BASE = "http://localhost:8000"
USER = "user_demo_001"

def record_wav(seconds=5):
    print(f"  Recording {seconds}s... SPEAK NOW!")
    data = sd.rec(int(seconds * 16000), samplerate=16000, channels=1, dtype="float32")
    sd.wait()
    print("  Done recording.")
    buf = io.BytesIO()
    sf.write(buf, data, 16000, format="WAV")
    buf.seek(0)
    return buf

print("\n" + "="*50)
print("   VoiceCart Voice Auth — End-to-End Test")
print("="*50)

# ── 1. Enroll ────────────────────────────────────
print("\n[1/4] ENROLL — speak for 5 seconds (your voice)")
audio = record_wav(5)
r = requests.post(
    f"{BASE}/api/voice/enroll",
    data={"user_id": USER},
    files={"audio_file": ("enroll.wav", audio, "audio/wav")},
)
print(f"  Response: {r.json()}")

# ── 2. Verify — correct voice ────────────────────
input("\n[2/4] VERIFY (YOUR voice) — press Enter, then speak 4 seconds...")
audio2 = record_wav(4)
r = requests.post(
    f"{BASE}/api/voice/verify",
    data={"user_id": USER},
    files={"audio_file": ("verify.wav", audio2, "audio/wav")},
)
result = r.json()
icon = "✅ VERIFIED" if result.get("verified") else "❌ REJECTED"
print(f"  {icon} | score={result.get('score')} | {result.get('message')}")

# ── 3. Verify — wrong voice (ask someone else / change voice) ──
input("\n[3/4] VERIFY (DIFFERENT voice) — press Enter, then speak in a very different way (or ask someone else)...")
audio3 = record_wav(4)
r = requests.post(
    f"{BASE}/api/voice/verify",
    data={"user_id": USER},
    files={"audio_file": ("wrong.wav", audio3, "audio/wav")},
)
result = r.json()
icon = "✅ VERIFIED" if result.get("verified") else "❌ REJECTED"
print(f"  {icon} | score={result.get('score')} | {result.get('message')}")

# ── 4. Status check ───────────────────────────────
print("\n[4/4] STATUS CHECK")
r = requests.get(f"{BASE}/api/voice/status", params={"user_id": USER})
print(f"  Response: {r.json()}")

print("\n" + "="*50)
print("   Test complete! (threshold = 0.92)")
print("   Your voice should be >0.92, others <0.92")
print("="*50 + "\n")
