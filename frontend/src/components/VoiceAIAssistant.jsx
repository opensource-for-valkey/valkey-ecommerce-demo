import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LockKey,
  Microphone,
  ShieldCheck,
  Sparkle,
  Waveform,
} from "@phosphor-icons/react";
import "./VoiceAIAssistant.scss";

const API_BASE = "http://localhost:8000";
const PROFILE_NAMESPACE = "valkey-ai-voice-profile";
const SILENCE_HIDE_DELAY = 1900;
const RESET_DELAY = 420;

const getRecognitionConstructor = () =>
  window.SpeechRecognition || window.webkitSpeechRecognition;

const getAccountKey = () => {
  const storedAccount =
    window.localStorage.getItem("activeAccountId") ||
    window.localStorage.getItem("accountId") ||
    window.localStorage.getItem("userId");
  return storedAccount || "default-account";
};

const generateSessionId = () =>
  "va_" + Math.random().toString(36).substr(2, 9);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const roundMetric = (value) => Number(value.toFixed(4));

const polishTranscript = (text, shouldFinalize = false) => {
  const replacements = [
    [/\bi\b/g, "I"],
    [/\bim\b/gi, "I'm"],
    [/\bi'm\b/gi, "I'm"],
    [/\bdont\b/gi, "don't"],
    [/\bcant\b/gi, "can't"],
    [/\bwont\b/gi, "won't"],
    [/\bshouldnt\b/gi, "shouldn't"],
    [/\bcouldnt\b/gi, "couldn't"],
    [/\bwouldnt\b/gi, "wouldn't"],
    [/\bpls\b/gi, "please"],
    [/\bplz\b/gi, "please"],
    [/\bu\b/g, "you"],
    [/\bur\b/g, "your"],
    [/\bai\b/gi, "AI"],
  ];

  let polished = text.replace(/\s+/g, " ").trim();
  replacements.forEach(([pattern, replacement]) => {
    polished = polished.replace(pattern, replacement);
  });

  if (polished.length > 0) {
    polished = polished.charAt(0).toUpperCase() + polished.slice(1);
  }
  if (shouldFinalize && polished && !/[.!?]$/.test(polished)) {
    polished += ".";
  }
  return polished;
};

const extractVoiceMetrics = (frames) => {
  if (!frames.length) return null;
  const totals = frames.reduce(
    (acc, frame) => ({
      rms: acc.rms + frame.rms,
      zcr: acc.zcr + frame.zcr,
      centroid: acc.centroid + frame.centroid,
      dominant: acc.dominant + frame.dominant,
      low: acc.low + frame.low,
      mid: acc.mid + frame.mid,
      high: acc.high + frame.high,
    }),
    { rms: 0, zcr: 0, centroid: 0, dominant: 0, low: 0, mid: 0, high: 0 }
  );
  const count = frames.length;
  return {
    rms: roundMetric(totals.rms / count),
    zcr: roundMetric(totals.zcr / count),
    centroid: roundMetric(totals.centroid / count),
    dominant: roundMetric(totals.dominant / count),
    low: roundMetric(totals.low / count),
    mid: roundMetric(totals.mid / count),
    high: roundMetric(totals.high / count),
  };
};

const readVoiceProfile = (profileKey) => {
  try {
    const saved = window.localStorage.getItem(profileKey);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const createFrame = (timeData, frequencyData) => {
  let sumSquares = 0;
  let zeroCrossings = 0;
  let previousSign = 0;

  for (let i = 0; i < timeData.length; i++) {
    const sample = (timeData[i] - 128) / 128;
    sumSquares += sample * sample;
    const sign = sample >= 0 ? 1 : -1;
    if (i > 0 && sign !== previousSign) zeroCrossings++;
    previousSign = sign;
  }

  const rms = Math.sqrt(sumSquares / timeData.length);
  let weightedFreq = 0, totalEnergy = 0, dominantIdx = 0, dominantVal = 0;
  let lowEnergy = 0, midEnergy = 0, highEnergy = 0;
  const third = frequencyData.length / 3;

  for (let i = 0; i < frequencyData.length; i++) {
    const energy = frequencyData[i] / 255;
    totalEnergy += energy;
    weightedFreq += energy * i;
    if (energy > dominantVal) { dominantVal = energy; dominantIdx = i; }
    if (i < third) lowEnergy += energy;
    else if (i < third * 2) midEnergy += energy;
    else highEnergy += energy;
  }

  const safeTotal = totalEnergy || 1;
  return {
    rms: clamp(rms, 0, 1),
    zcr: clamp(zeroCrossings / timeData.length, 0, 1),
    centroid: clamp(weightedFreq / safeTotal / frequencyData.length, 0, 1),
    dominant: clamp(dominantIdx / frequencyData.length, 0, 1),
    low: clamp(lowEnergy / safeTotal, 0, 1),
    mid: clamp(midEnergy / safeTotal, 0, 1),
    high: clamp(highEnergy / safeTotal, 0, 1),
  };
};

const captureVoiceprint = async (duration = 1700) => {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("microphone-unavailable");

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
  });

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.35;
  source.connect(analyser);

  const timeData = new Uint8Array(analyser.fftSize);
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  const frames = [];
  const startedAt = performance.now();

  try {
    return await new Promise((resolve) => {
      const readFrame = () => {
        analyser.getByteTimeDomainData(timeData);
        analyser.getByteFrequencyData(frequencyData);
        const frame = createFrame(timeData, frequencyData);
        if (frame.rms > 0.015) frames.push(frame);
        if (performance.now() - startedAt >= duration) {
          resolve(extractVoiceMetrics(frames));
          return;
        }
        requestAnimationFrame(readFrame);
      };
      readFrame();
    });
  } finally {
    stream.getTracks().forEach((t) => t.stop());
    await audioContext.close();
  }
};

const compareVoiceprints = (registered, live) => {
  if (!registered || !live) return { matched: false, score: 0 };

  const weights = { rms: 0.65, zcr: 1, centroid: 2.2, dominant: 1.6, low: 1.2, mid: 1.1, high: 1 };
  const weightedDiff = Object.entries(weights).reduce(
    (diff, [metric, weight]) => diff + Math.abs(registered[metric] - live[metric]) * weight,
    0
  );
  const totalWeight = Object.values(weights).reduce((t, w) => t + w, 0);
  const score = clamp(1 - (weightedDiff / totalWeight) * 2.25, 0, 1);
  return { matched: score >= 0.52, score };
};

function VoiceAIAssistant() {
  const accountKey = useMemo(getAccountKey, []);
  const profileKey = `${PROFILE_NAMESPACE}:${accountKey}`;
  const sessionId = useMemo(generateSessionId, []);

  const recognitionRef = useRef(null);
  const hideTimerRef = useRef(null);
  const resetTimerRef = useRef(null);
  const finalTranscriptRef = useRef("");

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [securityScore, setSecurityScore] = useState(null);
  const [hasProfile, setHasProfile] = useState(() => Boolean(readVoiceProfile(profileKey)));

  // Chat API state
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const clearTimers = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    window.clearTimeout(resetTimerRef.current);
  }, []);

  const resetAssistant = useCallback(() => {
    finalTranscriptRef.current = "";
    setTranscript("");
    setSecurityScore(null);
    setStatus("idle");
    setAiResponse("");
    setAiLoading(false);
  }, []);

  // Send transcript to backend chat API
  const sendToChat = useCallback(async (text) => {
    if (!text || !text.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch(`${API_BASE}/api/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), session_id: sessionId }),
      });
      const data = await res.json();
      setAiResponse(data.response || "");
    } catch {
      setAiResponse("Could not reach the AI. Make sure the backend is running.");
    } finally {
      setAiLoading(false);
    }
  }, [sessionId]);

  const closeAfterCompletion = useCallback(
    (nextStatus = "complete") => {
      window.clearTimeout(hideTimerRef.current);
      setStatus(nextStatus);

      const finalText = polishTranscript(finalTranscriptRef.current, true);
      setTranscript(finalText);

      // Send to AI if we have a transcript and voice was verified
      if (finalText && nextStatus === "complete") {
        sendToChat(finalText);
      }

      // Only auto-close if there's no AI response to show
      // When aiResponse arrives, panel stays open so user can read it
    },
    [sendToChat]
  );

  const scheduleSilenceHide = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      recognitionRef.current?.stop();
      closeAfterCompletion("complete");
    }, SILENCE_HIDE_DELAY);
  }, [closeAfterCompletion]);

  // Close panel after AI response is shown (3.5s read time)
  useEffect(() => {
    if (aiResponse && status === "complete") {
      hideTimerRef.current = window.setTimeout(() => {
        setIsOpen(false);
        resetTimerRef.current = window.setTimeout(resetAssistant, RESET_DELAY);
      }, 3500);
    }
  }, [aiResponse, status, resetAssistant]);

  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = getRecognitionConstructor();
    if (!SpeechRecognition) {
      setStatus("unsupported");
      closeAfterCompletion("unsupported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setStatus("listening");
      scheduleSilenceHide();
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const phrase = result[0]?.transcript || "";
        if (result.isFinal) finalTranscript += `${phrase} `;
        else interimTranscript += `${phrase} `;
      }

      finalTranscriptRef.current = finalTranscript;
      setTranscript(polishTranscript(`${finalTranscript} ${interimTranscript}`));
      scheduleSilenceHide();
    };

    recognition.onerror = () => closeAfterCompletion("blocked");
    recognition.onend = () => {
      if (finalTranscriptRef.current || transcript) {
        closeAfterCompletion("complete");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [closeAfterCompletion, scheduleSilenceHide, transcript]);

  const enrollVoiceProfile = useCallback(async () => {
    setStatus("enrolling");
    setTranscript("");

    const voiceprint = await captureVoiceprint(2100);
    if (!voiceprint) {
      closeAfterCompletion("quiet");
      return;
    }

    window.localStorage.setItem(
      profileKey,
      JSON.stringify({ accountKey, createdAt: new Date().toISOString(), voiceprint })
    );

    setHasProfile(true);
    setSecurityScore(1);
    setStatus("verified");
    startSpeechRecognition();
  }, [accountKey, closeAfterCompletion, profileKey, startSpeechRecognition]);

  const authenticateVoice = useCallback(async () => {
    const savedProfile = readVoiceProfile(profileKey);
    if (!savedProfile?.voiceprint) {
      await enrollVoiceProfile();
      return;
    }

    setStatus("authenticating");
    setTranscript("");
    const liveVoiceprint = await captureVoiceprint(1650);
    if (!liveVoiceprint) {
      closeAfterCompletion("quiet");
      return;
    }

    const result = compareVoiceprints(savedProfile.voiceprint, liveVoiceprint);
    setSecurityScore(result.score);

    if (!result.matched) {
      closeAfterCompletion("mismatch");
      return;
    }

    setStatus("verified");
    startSpeechRecognition();
  }, [closeAfterCompletion, enrollVoiceProfile, profileKey, startSpeechRecognition]);

  const handleMicPress = useCallback(async () => {
    clearTimers();

    if (status === "listening") {
      recognitionRef.current?.stop();
      closeAfterCompletion("complete");
      return;
    }

    setIsOpen(true);
    setAiResponse("");

    try {
      await authenticateVoice();
    } catch {
      closeAfterCompletion("blocked");
    }
  }, [authenticateVoice, clearTimers, closeAfterCompletion, status]);

  useEffect(() => {
    return () => {
      clearTimers();
      recognitionRef.current?.abort();
    };
  }, [clearTimers]);

  const displayedText = transcript || "Message ....";
  const scorePercentage = securityScore === null ? null : `${Math.round(securityScore * 100)}%`;
  const isListening = status === "listening";
  const isProcessing = status === "enrolling" || status === "authenticating" || status === "verified";

  return (
    <div className={`voice-ai ${isOpen ? "voice-ai--open" : ""}`}>
      <div className="voice-ai__panel" role="status" aria-live="polite">
        {/* Security strip */}
        <div className="voice-ai__secure-strip">
          <span className="voice-ai__secure-icon" aria-hidden="true">
            {hasProfile ? <ShieldCheck size={16} weight="fill" /> : <LockKey size={16} />}
          </span>
          <span className="voice-ai__secure-text">
            {status === "enrolling" && "Creating voice profile"}
            {status === "authenticating" && "Authenticating voice"}
            {status === "verified" && "Voice verified"}
            {status === "listening" && "Listening securely"}
            {status === "mismatch" && "Voice mismatch"}
            {status === "quiet" && "No voice detected"}
            {status === "blocked" && "Microphone access needed"}
            {status === "unsupported" && "Voice input unavailable"}
            {(status === "idle" || status === "complete") &&
              (hasProfile ? "Voice profile locked" : "Secure voice setup")}
          </span>
          {scorePercentage && (
            <span className="voice-ai__score" aria-label="Voice match score">
              {scorePercentage}
            </span>
          )}
        </div>

        {/* Transcript message */}
        <div className="voice-ai__message">
          <Microphone
            className={`voice-ai__message-icon ${isListening ? "is-listening" : ""}`}
            size={22}
            weight={isListening ? "fill" : "duotone"}
          />
          <p>{displayedText}</p>
          {isListening && (
            <span className="voice-ai__wave" aria-hidden="true">
              <Waveform size={22} weight="bold" />
            </span>
          )}
        </div>

        {/* AI Response panel */}
        {(aiLoading || aiResponse) && (
          <div className="voice-ai__ai-reply">
            <div className="voice-ai__ai-reply-header">
              <Sparkle size={13} weight="fill" />
              <span>AI</span>
            </div>
            {aiLoading ? (
              <div className="voice-ai__ai-dots">
                <span /><span /><span />
              </div>
            ) : (
              <p className="voice-ai__ai-text">{aiResponse}</p>
            )}
          </div>
        )}
      </div>

      {/* Floating mic button */}
      <button
        className={`voice-ai__button ${isListening ? "is-listening" : ""}`}
        type="button"
        aria-label="Open secure AI voice microphone"
        aria-pressed={isListening}
        disabled={isProcessing}
        onClick={handleMicPress}
      >
        <span className="voice-ai__pulse" aria-hidden="true" />
        <Microphone size={30} weight="fill" />
        <span className="voice-ai__spark" aria-hidden="true">
          <Sparkle size={15} weight="fill" />
        </span>
        <span className="voice-ai__label">AI</span>
      </button>
    </div>
  );
}

export default VoiceAIAssistant;
