# Frontend Plan — Voice Authentication (Speaker Verification)
> This document is for Member 4 (Frontend). Follow this step by step.

---

## What You Are Building

Two things:
1. **Voice Enrollment** — Record the user's voice once so the system learns it
2. **Voice Verification** — Every time the mic button is pressed, verify it's the same person before sending the command to the agent

---

## How The Full Flow Works

```
FIRST TIME (Enrollment)
─────────────────────────────────────────────────
User opens app
    ↓
Check: has this user enrolled? → NO
    ↓
Show <VoiceEnrollment /> screen
    ↓
User clicks "Record My Voice" → speaks for 5 seconds
    ↓
Audio sent to POST /api/voice/enroll
    ↓
Backend stores voice fingerprint in Valkey
    ↓
Show "Voice registered! You're all set." → go to main app


EVERY VOICE COMMAND (Verification)
─────────────────────────────────────────────────
User presses mic button
    ↓
Record audio (mic button turns red)
    ↓
User stops speaking
    ↓
Audio sent to POST /api/voice/verify  ← CHECK FIRST
    ↓
    ├── score > 0.80 → ✅ VERIFIED
    │       ↓
    │   Send transcript to POST /api/agent/chat
    │       ↓
    │   Speak the agent's response aloud
    │
    └── score < 0.80 → ❌ REJECTED
            ↓
        Speak: "Sorry, I don't recognise your voice."
        Show red error state
        DROP the command — nothing happens
```

---

## API Contracts (What Backend Gives You)

### 1. Enroll Voice
```
POST /api/voice/enroll
Content-Type: multipart/form-data

Body:
  audio_file: <audio blob>   ← WAV or WebM recording
  user_id:    "user_123"     ← logged in user's ID

Response (success):
{
  "status": "enrolled",
  "user_id": "user_123",
  "message": "Voice registered successfully"
}

Response (error):
{
  "status": "error",
  "message": "Audio too short. Please speak for at least 3 seconds."
}
```

### 2. Verify Voice
```
POST /api/voice/verify
Content-Type: multipart/form-data

Body:
  audio_file: <audio blob>   ← WAV or WebM recording
  user_id:    "user_123"

Response (verified):
{
  "verified": true,
  "score": 0.91,
  "message": "Voice verified"
}

Response (rejected):
{
  "verified": false,
  "score": 0.43,
  "message": "Voice not recognised"
}
```

### 3. Chat (existing — only call after verify passes)
```
POST /api/agent/chat
Content-Type: application/json

Body:
{
  "message": "show me Samsung phones",
  "session_id": "session_abc123"
}

Response:
{
  "response": "Found 3 Samsung phones...",
  "session_id": "session_abc123"
}
```

### 4. Check Enrollment Status
```
GET /api/voice/status?user_id=user_123

Response:
{
  "enrolled": true,
  "user_id": "user_123"
}
```

---

## Files You Need to Create/Edit

```
frontend/src/
├── components/
│   ├── VoiceEnrollment.jsx     ← NEW — enrollment screen
│   ├── VoiceButton.jsx         ← EDIT — add verify step
│   └── VoiceChat.jsx           ← EDIT — add enrollment check
├── hooks/
│   ├── useVoice.js             ← EDIT — add audio blob capture
│   └── useSpeakerVerify.js     ← NEW — enrollment + verify logic
└── api/
    ├── voiceApi.js             ← NEW — enroll + verify API calls
    └── chatApi.js              ← existing
```

---

## Step 1 — Create `api/voiceApi.js`

```jsx
// frontend/src/api/voiceApi.js

const BASE_URL = "http://localhost:8000";

export async function enrollVoice(audioBlob, userId) {
  const formData = new FormData();
  formData.append("audio_file", audioBlob, "enroll.wav");
  formData.append("user_id", userId);

  const res = await fetch(`${BASE_URL}/api/voice/enroll`, {
    method: "POST",
    body: formData,
  });
  return await res.json();
}

export async function verifyVoice(audioBlob, userId) {
  const formData = new FormData();
  formData.append("audio_file", audioBlob, "verify.wav");
  formData.append("user_id", userId);

  const res = await fetch(`${BASE_URL}/api/voice/verify`, {
    method: "POST",
    body: formData,
  });
  return await res.json();
}

export async function checkEnrollmentStatus(userId) {
  const res = await fetch(`${BASE_URL}/api/voice/status?user_id=${userId}`);
  return await res.json();
}
```

---

## Step 2 — Create `hooks/useSpeakerVerify.js`

This hook handles all enrollment and verification logic.

```jsx
// frontend/src/hooks/useSpeakerVerify.js
import { useState, useRef } from "react";
import { enrollVoice, verifyVoice, checkEnrollmentStatus } from "../api/voiceApi";

export function useSpeakerVerify(userId) {
  const [isEnrolled, setIsEnrolled] = useState(null); // null = unknown, true/false
  const [isRecording, setIsRecording] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState("idle"); // idle | recording | verifying | verified | rejected
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Check if user is enrolled on mount
  const checkEnrolled = async () => {
    const data = await checkEnrollmentStatus(userId);
    setIsEnrolled(data.enrolled);
    return data.enrolled;
  };

  // Start recording audio
  const startRecording = () => {
    return new Promise(async (resolve) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        resolve(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    });
  };

  // Stop recording and return blob
  const stopRecording = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          resolve(audioBlob);
        };
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    });
  };

  // Enroll: record 5 seconds and send to backend
  const enroll = async () => {
    setVerifyStatus("recording");
    const audioBlob = await startRecording();

    // Auto-stop after 5 seconds
    await new Promise((r) => setTimeout(r, 5000));
    const blob = await stopRecording();

    setVerifyStatus("verifying");
    const result = await enrollVoice(blob, userId);

    if (result.status === "enrolled") {
      setIsEnrolled(true);
      setVerifyStatus("verified");
    } else {
      setVerifyStatus("rejected");
    }
    return result;
  };

  // Verify: record voice command and check identity before sending to agent
  const recordAndVerify = async () => {
    setVerifyStatus("recording");
    const audioBlob = await startRecording();
    return audioBlob; // caller stops recording when user stops speaking
  };

  const verify = async (audioBlob) => {
    setVerifyStatus("verifying");
    const result = await verifyVoice(audioBlob, userId);

    if (result.verified) {
      setVerifyStatus("verified");
    } else {
      setVerifyStatus("rejected");
      // Reset after 3 seconds
      setTimeout(() => setVerifyStatus("idle"), 3000);
    }
    return result;
  };

  return {
    isEnrolled,
    isRecording,
    verifyStatus,
    checkEnrolled,
    enroll,
    startRecording,
    stopRecording,
    verify,
  };
}
```

---

## Step 3 — Create `components/VoiceEnrollment.jsx`

This screen is shown the FIRST time a user opens the app.

```jsx
// frontend/src/components/VoiceEnrollment.jsx
import { useState } from "react";
import { useSpeakerVerify } from "../hooks/useSpeakerVerify";

export default function VoiceEnrollment({ userId, onEnrolled }) {
  const [step, setStep] = useState("intro"); // intro | recording | done | error
  const [countdown, setCountdown] = useState(5);
  const { enroll, verifyStatus } = useSpeakerVerify(userId);

  const handleStartEnrollment = async () => {
    setStep("recording");

    // Countdown timer
    let count = 5;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) clearInterval(timer);
    }, 1000);

    const result = await enroll();

    if (result.status === "enrolled") {
      setStep("done");
      setTimeout(() => onEnrolled(), 2000); // go to main app after 2s
    } else {
      setStep("error");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>

        {/* STEP: Intro */}
        {step === "intro" && (
          <>
            <div style={styles.icon}>🎤</div>
            <h2 style={styles.title}>Set Up Your Voice</h2>
            <p style={styles.subtitle}>
              VoiceCart uses your unique voice to keep your account secure.
              Only your voice can control your cart.
            </p>
            <div style={styles.instructions}>
              <p>When you click the button below:</p>
              <ul style={{ textAlign: "left", lineHeight: 2 }}>
                <li>Speak clearly for <strong>5 seconds</strong></li>
                <li>Say something like: <em>"Hi, I'm setting up my VoiceCart account"</em></li>
                <li>Stay in a quiet place</li>
              </ul>
            </div>
            <button style={styles.primaryBtn} onClick={handleStartEnrollment}>
              🎙️ Record My Voice
            </button>
          </>
        )}

        {/* STEP: Recording */}
        {step === "recording" && (
          <>
            <div style={{ ...styles.icon, animation: "pulse 1s infinite" }}>🔴</div>
            <h2 style={styles.title}>Recording...</h2>
            <div style={styles.countdown}>{countdown}</div>
            <p style={styles.subtitle}>Speak naturally. Keep talking until timer ends.</p>
            <p style={{ color: "#9CA3AF", fontSize: 13 }}>
              Try: "Hi VoiceCart, this is my voice. Please remember it."
            </p>
          </>
        )}

        {/* STEP: Done */}
        {step === "done" && (
          <>
            <div style={styles.icon}>✅</div>
            <h2 style={styles.title}>Voice Registered!</h2>
            <p style={styles.subtitle}>
              Your voice fingerprint has been saved securely.
              Only you can control your VoiceCart now.
            </p>
            <p style={{ color: "#6941C6", fontWeight: 600 }}>Taking you to the store...</p>
          </>
        )}

        {/* STEP: Error */}
        {step === "error" && (
          <>
            <div style={styles.icon}>❌</div>
            <h2 style={styles.title}>Registration Failed</h2>
            <p style={styles.subtitle}>
              The audio was too short or unclear. Please try again in a quiet place.
            </p>
            <button style={styles.primaryBtn} onClick={() => { setStep("intro"); setCountdown(5); }}>
              Try Again
            </button>
          </>
        )}

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 40,
    maxWidth: 420,
    width: "90%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 8 },
  subtitle: { color: "#6B7280", fontSize: 15, marginBottom: 20, lineHeight: 1.6 },
  instructions: {
    background: "#F9FAFB", borderRadius: 12,
    padding: "16px 20px", marginBottom: 24, fontSize: 14, color: "#374151",
  },
  countdown: {
    fontSize: 72, fontWeight: 800, color: "#6941C6", lineHeight: 1, marginBottom: 8,
  },
  primaryBtn: {
    background: "#6941C6", color: "#fff",
    border: "none", borderRadius: 12,
    padding: "14px 32px", fontSize: 16,
    fontWeight: 600, cursor: "pointer",
    width: "100%",
  },
};
```

---

## Step 4 — Edit `hooks/useVoice.js`

Update to capture audio blob alongside transcript.

```jsx
// frontend/src/hooks/useVoice.js
import { useState, useEffect, useRef } from "react";

export function useVoice(onResult) {
  const [status, setStatus] = useState("idle");
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onResult(transcript); // just transcript, audio blob handled separately
      setStatus("idle");
    };
    rec.onerror = () => setStatus("idle");
    rec.onend = () => setStatus(s => s === "listening" ? "idle" : s);
    recognitionRef.current = rec;
  }, []);

  // Start recording: both speech recognition + audio blob capture
  const startListening = async () => {
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.start(100); // collect chunks every 100ms
    } catch (err) {
      console.error("Mic access denied", err);
    }

    if (recognitionRef.current) {
      recognitionRef.current.start();
      setStatus("listening");
    }
  };

  // Stop recording and return audio blob
  const stopListening = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          resolve(audioBlob);
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve(null);
      }
    });
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 1.0;
    setStatus("speaking");
    u.onend = () => setStatus("idle");
    window.speechSynthesis.speak(u);
  };

  return { status, setStatus, startListening, stopListening, speak };
}
```

---

## Step 5 — Edit `components/VoiceButton.jsx`

Add visual state for "verifying" and "rejected".

```jsx
// frontend/src/components/VoiceButton.jsx

const BUTTON_CONFIG = {
  idle:       { bg: "#6941C6", emoji: "🎤", label: "Tap to speak" },
  listening:  { bg: "#EF4444", emoji: "🔴", label: "Listening..." },
  verifying:  { bg: "#F59E0B", emoji: "🔒", label: "Verifying voice..." },
  thinking:   { bg: "#3B82F6", emoji: "💭", label: "Thinking..." },
  speaking:   { bg: "#10B981", emoji: "🔊", label: "Speaking..." },
  verified:   { bg: "#10B981", emoji: "✅", label: "Voice verified!" },
  rejected:   { bg: "#EF4444", emoji: "🚫", label: "Voice not recognised" },
};

export default function VoiceButton({ status, onPress }) {
  const config = BUTTON_CONFIG[status] || BUTTON_CONFIG.idle;
  const isListening = status === "listening";

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={onPress}
        disabled={["verifying", "thinking", "speaking"].includes(status)}
        style={{
          width: 90, height: 90, borderRadius: "50%",
          background: config.bg,
          border: "none", cursor: ["verifying","thinking","speaking"].includes(status) ? "not-allowed" : "pointer",
          fontSize: 36, color: "white",
          boxShadow: isListening
            ? "0 0 0 12px rgba(239,68,68,0.2)"
            : `0 4px 16px ${config.bg}55`,
          transition: "all 0.2s ease",
          animation: isListening ? "pulse 1s infinite" : "none",
          opacity: ["verifying","thinking","speaking"].includes(status) ? 0.8 : 1,
        }}
      >
        {config.emoji}
      </button>
      <p style={{ marginTop: 10, color: "#9CA3AF", fontSize: 13 }}>
        {config.label}
      </p>
    </div>
  );
}
```

---

## Step 6 — Edit `components/VoiceChat.jsx`

This is the main component — wire everything together.

```jsx
// frontend/src/components/VoiceChat.jsx
import { useState, useEffect } from "react";
import { useVoice } from "../hooks/useVoice";
import { useSpeakerVerify } from "../hooks/useSpeakerVerify";
import VoiceButton from "./VoiceButton";
import VoiceEnrollment from "./VoiceEnrollment";
import ProductCard from "./ProductCard";
import { sendMessage } from "../api/chatApi";

// Hardcoded for now — replace with real auth user ID when login is added
const USER_ID = "user_demo_001";
const SESSION_ID = "session_" + Math.random().toString(36).slice(2);

export default function VoiceChat() {
  const [messages, setMessages]     = useState([]);
  const [products, setProducts]     = useState([]);
  const [uiStatus, setUiStatus]     = useState("idle");
  const [showEnroll, setShowEnroll] = useState(false);

  const { checkEnrolled, verify } = useSpeakerVerify(USER_ID);

  // On mount — check if user needs to enroll
  useEffect(() => {
    checkEnrolled().then((enrolled) => {
      if (!enrolled) setShowEnroll(true);
    });
  }, []);

  const handleTranscript = async (transcript, audioBlob) => {
    // Step 1: Verify voice identity
    setUiStatus("verifying");
    const verifyResult = await verify(audioBlob);

    if (!verifyResult.verified) {
      // REJECTED — not the enrolled user's voice
      setUiStatus("rejected");
      speak(`Sorry, I don't recognise your voice. Score was ${Math.round(verifyResult.score * 100)}%.`);
      setMessages(prev => [...prev, {
        role: "system",
        text: `🚫 Voice not recognised (score: ${Math.round(verifyResult.score * 100)}%). Command dropped.`,
        isRejection: true,
      }]);
      setTimeout(() => setUiStatus("idle"), 3000);
      return; // DROP the command — do not send to agent
    }

    // Step 2: Voice verified — process the command
    setUiStatus("thinking");
    setMessages(prev => [...prev, { role: "user", text: transcript }]);

    const data = await sendMessage(transcript, SESSION_ID);
    if (data.products?.length > 0) setProducts(data.products);

    setMessages(prev => [...prev, { role: "agent", text: data.response }]);
    speak(data.response);
  };

  const { status: voiceStatus, startListening, stopListening, speak } = useVoice(
    (transcript) => {} // transcript handled below
  );

  // Handle mic button press
  const handleMicPress = async () => {
    if (uiStatus === "listening") {
      // Stop and process
      const audioBlob = await stopListening();
      // Also get transcript via speech recognition (handled in useVoice)
    } else if (uiStatus === "idle") {
      await startListening();
      setUiStatus("listening");
    }
  };

  // When speech recognition gives transcript, also stop audio recording
  const handleVoiceResult = async (transcript) => {
    const audioBlob = await stopListening();
    await handleTranscript(transcript, audioBlob);
  };

  const { startListening: startListen, stopListening: stopListen, speak: speakText } =
    useVoice(handleVoiceResult);

  return (
    <>
      {/* Enrollment Modal — shown on first visit */}
      {showEnroll && (
        <VoiceEnrollment
          userId={USER_ID}
          onEnrolled={() => setShowEnroll(false)}
        />
      )}

      <div style={{ maxWidth: 520, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
        <h2 style={{ textAlign: "center", color: "#6941C6" }}>🛒 VoiceCart AI</h2>

        {/* Mic Button */}
        <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
          <VoiceButton status={uiStatus} onPress={handleMicPress} />
        </div>

        {/* Product Cards */}
        {products.length > 0 && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {products.map((p, i) => <ProductCard key={i} product={p} />)}
          </div>
        )}

        {/* Chat Messages */}
        <div style={{ maxHeight: 320, overflowY: "auto" }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end"
                           : m.role === "system" ? "center"
                           : "flex-start",
              marginBottom: 8,
            }}>
              <div style={{
                background: m.isRejection ? "#FEE2E2"
                          : m.role === "user" ? "#6941C6"
                          : "#F3F4F6",
                color: m.isRejection ? "#DC2626"
                     : m.role === "user" ? "#fff"
                     : "#111",
                borderRadius: 12,
                padding: "8px 14px",
                maxWidth: "80%",
                fontSize: 14,
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

---

## Step 7 — Add CSS Animation to `index.css`

```css
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70%  { box-shadow: 0 0 0 18px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
```

---

## Complete Flow Summary

```
App opens
  ↓
checkEnrollmentStatus(userId)
  ↓
  ├── NOT enrolled → Show <VoiceEnrollment />
  │     ↓ user records 5 sec
  │     ↓ POST /api/voice/enroll
  │     ↓ enrolled = true → hide modal
  │
  └── enrolled → Show main <VoiceChat />
        ↓
      User presses 🎤
        ↓
      Record audio (MediaRecorder) + Speech Recognition
        ↓
      User stops speaking
        ↓
      POST /api/voice/verify (audio blob)
        ↓
        ├── verified: true  → POST /api/agent/chat (transcript)
        │                     → Speak response aloud
        │
        └── verified: false → Speak "Not your voice" 
                              → Show red rejection message
                              → Command dropped
```

---

## Testing Checklist

- [ ] Enrollment screen shows on first visit
- [ ] Recording countdown works (5, 4, 3, 2, 1)
- [ ] After enrollment, shows "Voice Registered" then goes to main app
- [ ] Mic button turns red when listening
- [ ] Button shows 🔒 "Verifying voice..." during verification
- [ ] Your own voice → command processes normally
- [ ] Someone else's voice → shows 🚫 rejection message
- [ ] Rejected command does NOT reach the agent
- [ ] Rejection message is spoken aloud
- [ ] Button returns to idle after rejection (3 seconds)

---

## While Backend Is Not Ready — Use This Mock

```jsx
// frontend/src/api/voiceApi.js  ← MOCK version for development

export async function enrollVoice(audioBlob, userId) {
  await new Promise(r => setTimeout(r, 1500)); // simulate delay
  return { status: "enrolled", user_id: userId };
}

export async function verifyVoice(audioBlob, userId) {
  await new Promise(r => setTimeout(r, 1000));
  // Randomly verify 80% of the time for testing
  const score = Math.random() * 0.4 + 0.65; // score between 0.65 and 1.05
  return {
    verified: score > 0.80,
    score: Math.min(score, 1.0),
    message: score > 0.80 ? "Voice verified" : "Voice not recognised"
  };
}

export async function checkEnrollmentStatus(userId) {
  const enrolled = localStorage.getItem(`enrolled_${userId}`) === "true";
  return { enrolled };
}
```

> Switch `voiceApi.js` from mock to real when backend `/api/voice/enroll` and `/api/voice/verify` endpoints are ready.

---

## Questions to Ask Backend (Member 1)

1. What is the exact URL for `/api/voice/enroll`?
2. What audio format does it accept — `audio/webm` or `audio/wav`?
3. What is the field name for the audio file in FormData?
4. Is there an auth token needed in headers?
