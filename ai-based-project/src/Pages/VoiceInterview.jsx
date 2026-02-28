import React, { useEffect, useRef, useState } from "react";
import {
  getMbaFocusAreas,
  getMbaJobRoleSuggestions,
  getMbaSpecialization,
  MBA_SPECIALIZATIONS,
} from "../utils/mbaCatalog";
import { fetchWithWarmupRetry } from "../utils/backendWarmup.js";

const VoiceInterview = () => {
  const streamRef = useRef(null);
  const monitorAudioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const [interviewDetails, setInterviewDetails] = useState({
    company: "",
    jobRole: "Software Engineer",
    level: "mid",
    focusArea: "behavioral",
    track: "tech",
    mbaSpecialization: "marketing",
  });

  const [permissionError, setPermissionError] = useState("");
  const [isMicOn, setIsMicOn] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [assistantHelp, setAssistantHelp] = useState(null); // { approach, sampleAnswer, spokenText }
  const [answerCheck, setAnswerCheck] = useState(null); // { index, answer, feedback, source }
  const [isChecking, setIsChecking] = useState(false);
  const [answerStructure, setAnswerStructure] = useState(null); // { title, template }
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStage, setInterviewStage] = useState("setup");
  const [feedback, setFeedback] = useState("");
  const lastCheckedAnswerRef = useRef("");

  const verdictStyles = (verdict) => {
    const v = String(verdict || "").toLowerCase();
    if (v === "strong")
      return "bg-green-600/20 text-green-200 border border-green-500/40";
    if (v === "okay")
      return "bg-yellow-600/20 text-yellow-200 border border-yellow-500/40";
    if (v === "weak")
      return "bg-red-600/20 text-red-200 border border-red-500/40";
    return "bg-gray-600/20 text-gray-200 border border-gray-500/40";
  };

  const persistHistoryToServer = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await fetch("/api/interview/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore
    }
  };

  const appendFeedbackToHistory = (text) => {
    const entry = {
      date: new Date().toISOString(),
      text,
      mode: "voice",
      company: interviewDetails.company,
      jobRole: interviewDetails.jobRole,
      level: interviewDetails.level,
      focusArea: interviewDetails.focusArea,
      track: interviewDetails.track,
      mbaSpecialization: interviewDetails.mbaSpecialization,
    };

    try {
      const stored = localStorage.getItem("interviewFeedback");
      const existing = stored ? JSON.parse(stored) : [];
      const history = Array.isArray(existing) ? existing : [];
      history.unshift(entry);
      localStorage.setItem(
        "interviewFeedback",
        JSON.stringify(history.slice(0, 20)),
      );
    } catch {
      localStorage.setItem("interviewFeedback", text);
    }

    void persistHistoryToServer(entry);
  };

  const persistPerQuestionHistory = (payload) => {
    const entry = {
      date: new Date().toISOString(),
      mode: "voice",
      company: interviewDetails.company,
      jobRole: interviewDetails.jobRole,
      level: interviewDetails.level,
      focusArea: interviewDetails.focusArea,
      track: interviewDetails.track,
      mbaSpecialization: interviewDetails.mbaSpecialization,
      ...payload,
    };

    try {
      const stored = localStorage.getItem("interviewQuestionHistory");
      const existing = stored ? JSON.parse(stored) : [];
      const history = Array.isArray(existing) ? existing : [];
      history.unshift(entry);
      localStorage.setItem(
        "interviewQuestionHistory",
        JSON.stringify(history.slice(0, 50)),
      );
    } catch {
      // ignore
    }

    void persistHistoryToServer(entry);
  };

  const recognitionRef = useRef(null);
  const sttSessionRef = useRef({ final: "", interim: "" });
  const shouldListenRef = useRef(false);
  const lastHelpQuestionIndexRef = useRef(-1);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlayVoice, setAutoPlayVoice] = useState(true);

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem("appSettings");
        const parsed = raw ? JSON.parse(raw) : null;
        const next =
          parsed && typeof parsed.autoPlayVoice === "boolean"
            ? parsed.autoPlayVoice
            : true;
        setAutoPlayVoice(next);
      } catch {
        setAutoPlayVoice(true);
      }
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("settings-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("settings-updated", sync);
    };
  }, []);

  const normalizeText = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();

  const getQuestionText = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") return String(item.question || item.q || "");
    return "";
  };

  const getIdealAnswer = (item) => {
    if (!item || typeof item !== "object") return "";
    return String(item.answer || item.a || "").trim();
  };

  const getReferences = (item) => {
    if (!item || typeof item !== "object") return [];
    return Array.isArray(item.references) ? item.references : [];
  };

  const normalizeCompany = (value) => normalizeText(value).toLowerCase();

  const isBuiltInCompany = (company) => {
    const c = normalizeCompany(company);
    return (
      c.includes("google") ||
      c.includes("amazon") ||
      c.includes("microsoft") ||
      c === "ms"
    );
  };

  const buildAnswerStructure = (question) => {
    const q = normalizeText(question);
    const qLower = q.toLowerCase();

    if (!q) {
      return {
        title: "Quick Structure",
        template:
          "1) 1-line summary\n" +
          "2) 2–3 supporting points\n" +
          "3) Example / evidence\n" +
          "4) Close with impact / learning",
      };
    }

    // Tell me about yourself
    if (/tell\s+me\s+about\s+yourself/i.test(q)) {
      return {
        title: "Tell Me About Yourself (Present–Past–Future)",
        template:
          "Present: I’m a ___ with ___ years of experience in ___.\n" +
          "Past: Recently I worked on ___, using ___, and achieved ___.\n" +
          "Future: I’m excited about this role because ___.\n" +
          "Close: My strengths are ___ and ___.",
      };
    }

    // Why company
    if (
      /^why\s+(google|amazon|microsoft)\b/i.test(q) ||
      (/\bwhy\b/.test(qLower) &&
        (qLower.includes("google") ||
          qLower.includes("amazon") ||
          qLower.includes("microsoft")))
    ) {
      return {
        title: "Why This Company (3 reasons)",
        template:
          "1) Mission/Product: I’m motivated by ___ (specific product/team).\n" +
          "2) Role fit: My experience in ___ matches ___ (requirement).\n" +
          "3) Growth/Impact: I want to grow in ___ and deliver ___.\n" +
          "Close: In the first 90 days, I can contribute by ___.",
      };
    }

    // Strengths / weaknesses
    if (/strengths?.*weakness|weakness|strengths?/i.test(q)) {
      return {
        title: "Strengths & Weakness (Balanced)",
        template:
          "Strength: ___\n" +
          "Proof: Example: ___\n" +
          "Impact: Result/metric: ___\n\n" +
          "Weakness: ___ (honest, non-fatal)\n" +
          "Fix: What I’m doing: ___\n" +
          "Progress: Evidence: ___",
      };
    }

    // Salary
    if (/salary\s+expectations|compensation/i.test(qLower)) {
      return {
        title: "Salary (Range + Flexibility)",
        template:
          "Range: Based on research, I’m targeting ___–___.\n" +
          "Factors: role scope, location, and total comp.\n" +
          "Flexibility: I’m flexible for the right role and growth.\n" +
          "Question: What’s the budgeted range for this position?",
      };
    }

    // End-of-interview questions
    if (/do\s+you\s+have\s+any\s+questions\?|end\s+of\s+your/i.test(qLower)) {
      return {
        title: "Questions To Ask (Pick 2–3)",
        template:
          "1) What does success look like in the first 90 days?\n" +
          "2) What are the biggest challenges for the team right now?\n" +
          "3) How do you measure impact for this role?\n" +
          "4) What is the interview timeline from here?",
      };
    }

    // Product improvement
    if (
      /improve\s+an\s+existing\s+google\s+product|improve\s+an\s+existing\s+product|improve\s+google\s+product/i.test(
        qLower,
      )
    ) {
      return {
        title: "Product Improvement (User–Problem–Solution)",
        template:
          "User: target user segment: ___\n" +
          "Problem: current pain point: ___\n" +
          "Goal metric: what improves (NPS/retention/latency): ___\n" +
          "Solution: 1–2 changes: ___\n" +
          "Trade-offs/Risks: ___\n" +
          "Rollout: A/B test + success criteria: ___",
      };
    }

    // System design
    if (
      /design\s+a\s+url\s+shortening|url\s+shorten|bit\.ly|design\s+a\s+.*service|system\s+design/i.test(
        qLower,
      )
    ) {
      return {
        title: "System Design (Clarify → Design → Scale)",
        template:
          "1) Clarify requirements: features + constraints (QPS, latency, storage).\n" +
          "2) API: endpoints + request/response.\n" +
          "3) Data model: tables/keys/indexes.\n" +
          "4) Architecture: services + DB + cache + queue.\n" +
          "5) Scaling: sharding, caching, rate limiting, CDN.\n" +
          "6) Reliability/security: retries, idempotency, abuse prevention.\n" +
          "7) Trade-offs + monitoring.",
      };
    }

    // URL in browser
    if (
      /what\s+happens\s+when\s+you\s+enter\s+a\s+url|web\s+browser/i.test(
        qLower,
      )
    ) {
      return {
        title: "Explain A Process (Steps + Why)",
        template:
          "1) DNS lookup → IP\n" +
          "2) TCP/TLS handshake\n" +
          "3) HTTP request/response\n" +
          "4) Parse HTML/CSS/JS\n" +
          "5) Render + load resources\n" +
          "6) Caching/CDN considerations\n" +
          "Close: key bottlenecks + how to debug.",
      };
    }

    // Behavioral (STAR)
    if (
      /\btell me about a time\b|\bdescribe a time\b|\bdisagreed\b|\bconflict\b|\bteam\s+project\b|\bchallenge\b|\bfeedback\b|\bcriticism\b|\bremote\s+team\b|\bstakeholder\b|\bteammate\b/i.test(
        qLower,
      )
    ) {
      return {
        title: "Behavioral (STAR + Metrics)",
        template:
          "S (Situation): context in 1–2 lines: ___\n" +
          "T (Task): what I owned / goal: ___\n" +
          "A (Action): 2–4 actions (communication + execution):\n" +
          "- ___\n- ___\n- ___\n" +
          "R (Result): measurable outcome + learning: ___",
      };
    }

    // Default technical
    return {
      title: "Technical (Explain + Example)",
      template:
        "1) Define in 1 line\n" +
        "2) Explain with a simple example\n" +
        "3) Key trade-offs / edge cases\n" +
        "4) Complexity / performance (if relevant)\n" +
        "5) Quick summary",
    };
  };

  const appendUnique = (base, addition) => {
    const b = normalizeText(base);
    const a = normalizeText(addition);
    if (!a) return b;
    if (!b) return a;
    // Avoid repeating same chunk (common with interim/continuous STT)
    if (b.toLowerCase().endsWith(a.toLowerCase())) return b;
    return `${b} ${a}`.trim();
  };

  const buildAssistantHelp = (question) => {
    const q = normalizeText(question);
    const isBehavioral =
      /\btell me about a time\b|\bhandled\b|\bconflict\b|\bstakeholder\b|\bteammate\b|\bdisagree\b/i.test(
        q,
      );

    // Company-specific sample (user-provided) for Microsoft Q1
    if (
      normalizeCompany(interviewDetails.company).includes("microsoft") &&
      /tell\s+me\s+about\s+yourself/i.test(q)
    ) {
      const approach =
        "Approach (60–90 seconds):\n" +
        "1) Present: current role/strengths\n" +
        "2) Past: 1–2 key achievements\n" +
        "3) Future: why this role/company\n" +
        "4) Close: what value you bring";

      const sampleAnswer =
        "I am somebody who loves to work hard, because hard work develops good habits. Hard work enables you to continually learn, and it gives you a sense of achievement that makes you feel positive and satisfied in your work. I would say I am a high-achiever and everything I have done in my life and career to date has been to a high standard. For example, in my last job my manager always noted during my performance reviews that I was someone who could be relied upon to complete difficult tasks and projects under pressure. Microsoft is an organization that anyone would feel proud to work for, and if I do get the chance to become a member of your team, you have my word that I will always work hard, I will contribute positively to the goals of my team, and I will always focus on the long-term vision of the organization to ensure it maintains its position as a market innovator and leader.";

      const spokenText =
        "Keep it structured: present, past, future. Mention one strong achievement and end with why Microsoft and what value you'll bring.";

      return { approach, sampleAnswer, spokenText };
    }

    if (!q) {
      return {
        approach: "Use STAR: Situation, Task, Action, Result.",
        sampleAnswer:
          "I’d answer using STAR. First I’ll give quick context, then what I owned, the actions I took, and the measurable outcome.",
        spokenText:
          "Use the STAR method: Situation, Task, Action, Result. Then share one concrete example with the outcome and what you learned.",
      };
    }

    if (isBehavioral) {
      const approach =
        "Approach (STAR in 60–90 seconds):\n" +
        "1) Situation: 1–2 lines of context\n" +
        "2) Task: what you were responsible for\n" +
        "3) Action: how you communicated, aligned, and executed\n" +
        "4) Result: impact + what you learned";

      let sampleAnswer =
        "Situation: In a previous project, a key stakeholder was unhappy with the pace and kept changing priorities mid-sprint.\n" +
        "Task: I needed to keep delivery on track while rebuilding trust and clarity.\n" +
        "Action: I scheduled a short alignment call to clarify the goal, asked for the top 1–2 must-haves, and wrote down acceptance criteria. I proposed a weekly checkpoint and shared a simple timeline with trade-offs (what we can do now vs later). I also kept the team informed so changes were controlled.\n" +
        "Result: The stakeholder felt heard, scope changes reduced, and we delivered the core feature on time. I learned to convert opinions into written requirements and to manage expectations with clear trade-offs.";

      if (/difficult\s+stakeholder|stakeholder|teammate/i.test(q)) {
        sampleAnswer =
          "Situation: On one project, a stakeholder strongly disagreed with our proposed approach and the conversations were getting tense.\n" +
          "Task: I had to move us from conflict to a decision without slowing delivery.\n" +
          "Action: I set up a focused discussion, listened first to understand their concerns, then summarized them to confirm. I brought data (requirements, constraints, risks) and presented 2 options with pros/cons. We agreed on clear acceptance criteria and a checkpoint to review progress.\n" +
          "Result: We aligned on a plan quickly, reduced rework, and shipped the feature. The relationship improved because communication became structured and transparent.";
      }

      const spokenText =
        "Use the STAR method. Keep it short: situation, what you owned, the actions you took like alignment and trade-offs, and end with the measurable result and learning.";

      return { approach, sampleAnswer, spokenText };
    }

    // Technical / generic fallback
    return {
      approach:
        "Approach:\n" +
        "1) Clarify requirements + constraints\n" +
        "2) Propose a solution + trade-offs\n" +
        "3) Explain complexity + edge cases\n" +
        "4) Validate with examples/tests",
      sampleAnswer:
        "First I would clarify the input/output and constraints. Then I’d propose a straightforward solution, discuss time/space complexity, handle edge cases, and validate with a couple of examples.",
      spokenText:
        "Start by clarifying requirements and constraints. Then propose a solution, discuss trade-offs and complexity, and validate with edge cases.",
    };
  };

  const stopSpeechRecognition = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    shouldListenRef.current = false;
    try {
      rec.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
    // Commit only the final transcript when stopping
    const finalText = normalizeText(sttSessionRef.current.final);
    if (finalText) setCurrentAnswer(finalText);
    sttSessionRef.current.interim = "";
  };

  const speakText = (text) => {
    try {
      const t = normalizeText(text);
      if (!t) return;
      if (typeof window === "undefined") return;
      if (!("speechSynthesis" in window)) return;

      // Avoid STT capturing the TTS voice
      if (isListening) stopSpeechRecognition();

      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(t);
      utter.lang = "en-IN";
      utter.rate = 1;
      utter.pitch = 1;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    } catch {
      // ignore
    }
  };

  const speakQuestion = (text) => {
    try {
      if (!text) return;
      if (typeof window === "undefined") return;
      if (!("speechSynthesis" in window)) return;

      // Avoid STT capturing the TTS voice
      if (isListening) stopSpeechRecognition();

      // Cancel any previous speech to avoid overlap
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-IN";
      utter.rate = 1;
      utter.pitch = 1;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    } catch {
      // ignore
    }
  };

  const stopSpeaking = () => {
    try {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    setIsSpeaking(false);
  };

  const provideInstantHelp = (reason) => {
    const q = getQuestionText(questions[currentQuestionIndex]);
    if (!q) return;
    if (lastHelpQuestionIndexRef.current === currentQuestionIndex) return;
    lastHelpQuestionIndexRef.current = currentQuestionIndex;

    const help = buildAssistantHelp(q);
    setAssistantHelp(help);
    setAnswerStructure(buildAnswerStructure(q));

    // If the user has no real answer (empty / "I don't know"), fill the sample answer.
    const cur = normalizeText(currentAnswer);
    const looksLikeIDK =
      /\b(idk|i\s*(do\s*not|don't)\s*know|i\s*dont\s*know|dont\s*know|no\s*idea|not\s*sure|can't\s*answer|cannot\s*answer)\b/i.test(
        cur,
      );
    if (!cur || looksLikeIDK || reason === "empty") {
      setCurrentAnswer(help.sampleAnswer);
      sttSessionRef.current.final = help.sampleAnswer;
      sttSessionRef.current.interim = "";
    }

    speakText(
      `${help.spokenText} Here's a sample answer. ${help.sampleAnswer}`,
    );
  };

  const checkCurrentAnswer = async () => {
    const q = getQuestionText(questions[currentQuestionIndex]);
    const a = normalizeText(currentAnswer);
    if (!q || !a) return null;

    setIsChecking(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/interview/check-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          company: interviewDetails.company,
          jobRole: interviewDetails.jobRole,
          level: interviewDetails.level,
          focusArea: interviewDetails.focusArea,
          track: interviewDetails.track,
          mbaSpecialization: interviewDetails.mbaSpecialization,
          question: q,
          answer: a,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          errText || `Failed to check answer (${response.status})`,
        );
      }

      const data = await response.json();
      const item = {
        index: currentQuestionIndex,
        answer: a,
        verdict: data?.verdict,
        score: typeof data?.score === "number" ? data.score : undefined,
        encouragement: data?.encouragement,
        resources: Array.isArray(data?.resources) ? data.resources : [],
        feedback: String(data?.feedback || "").trim(),
        source: data?.source || "unknown",
      };
      setAnswerCheck(item);
      lastCheckedAnswerRef.current = a;
      return item;
    } catch (e) {
      setAnswerCheck({
        index: currentQuestionIndex,
        answer: a,
        feedback: e?.message || "Unable to check answer right now.",
        source: "error",
      });
      lastCheckedAnswerRef.current = a;
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  const ensureMicStream = async () => {
    if (streamRef.current) return streamRef.current;
    await startMic();
    return streamRef.current;
  };

  const startMonitoring = async () => {
    setPermissionError("");
    try {
      const stream = await ensureMicStream();
      if (!stream) throw new Error("Microphone stream not available");

      const audioEl = monitorAudioRef.current;
      if (!audioEl) return;
      audioEl.srcObject = stream;
      audioEl.muted = false;
      audioEl.volume = 1;
      setIsMonitoring(true);
      try {
        await audioEl.play();
      } catch {
        // Autoplay can be blocked; user can press again
      }
    } catch (e) {
      setPermissionError(e?.message || "Unable to enable mic monitoring.");
      setIsMonitoring(false);
    }
  };

  const stopMonitoring = () => {
    const audioEl = monitorAudioRef.current;
    if (audioEl) {
      try {
        audioEl.pause();
      } catch {
        // ignore
      }
      audioEl.srcObject = null;
    }
    setIsMonitoring(false);
  };

  const startRecording = async () => {
    setPermissionError("");
    try {
      const stream = await ensureMicStream();
      if (!stream) throw new Error("Microphone stream not available");
      if (typeof MediaRecorder === "undefined") {
        throw new Error("Recording is not supported in this browser.");
      }

      if (recordedUrl) {
        try {
          URL.revokeObjectURL(recordedUrl);
        } catch {
          // ignore
        }
        setRecordedUrl("");
      }

      recordedChunksRef.current = [];

      const preferredTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
      ];
      const mimeType = preferredTypes.find((t) =>
        MediaRecorder.isTypeSupported(t),
      );

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0)
          recordedChunksRef.current.push(evt.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        recordedChunksRef.current = [];
      };

      recorder.start();
      setIsRecording(true);
    } catch (e) {
      setPermissionError(e?.message || "Unable to start recording.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
    } catch {
      // ignore
    }
    setIsRecording(false);
  };

  const stopMic = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    stopMonitoring();
    setIsMicOn(false);
  };

  const startMic = async () => {
    setPermissionError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;
      setIsMicOn(true);
    } catch (err) {
      setPermissionError(
        err?.message || "Microphone permission denied or unavailable.",
      );
      stopMic();
    }
  };

  useEffect(() => {
    // Setup speech recognition if available (optional)
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i]?.[0]?.transcript || "";
          if (event.results[i].isFinal) final += `${piece} `;
          else interim += `${piece} `;
        }

        if (final) {
          sttSessionRef.current.final = appendUnique(
            sttSessionRef.current.final,
            final,
          );
        }
        sttSessionRef.current.interim = normalizeText(interim);

        const combined = sttSessionRef.current.interim
          ? `${sttSessionRef.current.final} ${sttSessionRef.current.interim}`.trim()
          : normalizeText(sttSessionRef.current.final);

        setCurrentAnswer(combined);

        // If user says they don't know, immediately provide help (text + voice)
        if (
          /\b(idk|i\s*(do\s*not|don't)\s*know|i\s*dont\s*know|dont\s*know|no\s*idea|not\s*sure|can't\s*answer|cannot\s*answer)\b/i.test(
            combined,
          )
        ) {
          stopSpeechRecognition();
          provideInstantHelp("idk");
        }
      };

      rec.onerror = () => {
        shouldListenRef.current = false;
        setIsListening(false);
      };

      rec.onend = () => {
        // Browsers may stop recognition automatically after a pause even with continuous=true.
        // If the user intended to keep listening, restart it.
        const finalText = normalizeText(sttSessionRef.current.final);
        if (finalText) setCurrentAnswer(finalText);
        sttSessionRef.current.interim = "";

        if (shouldListenRef.current) {
          try {
            setTimeout(() => {
              try {
                rec.start();
                setIsListening(true);
              } catch {
                setIsListening(false);
              }
            }, 200);
          } catch {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      stopRecording();
      stopMic();
      shouldListenRef.current = false;
      try {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
      if (recordedUrl) {
        try {
          URL.revokeObjectURL(recordedUrl);
        } catch {
          // ignore
        }
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Speak the question when it changes ("interviewer" voice)
  useEffect(() => {
    if (interviewStage !== "interview") return;
    const q = questions[currentQuestionIndex];
    const qText = getQuestionText(q);
    if (!qText) return;
    setAnswerStructure(buildAnswerStructure(qText));
    setShowIdealAnswer(false);
    if (autoPlayVoice) speakQuestion(qText);
  }, [interviewStage, questions, currentQuestionIndex, autoPlayVoice]);

  const handleDetailChange = (field, value) => {
    setInterviewDetails((prev) => {
      if (field === "track") {
        const nextTrack = String(value || "");
        if (nextTrack === prev.track) return prev;

        if (nextTrack === "mba") {
          const spec = getMbaSpecialization(prev.mbaSpecialization);
          const mbaFocusAreas = getMbaFocusAreas(spec.key);
          const mbaRoles = getMbaJobRoleSuggestions(spec.key);

          const shouldAutoJobRole =
            !String(prev.jobRole || "").trim() ||
            String(prev.jobRole).toLowerCase().includes("software");

          return {
            ...prev,
            track: nextTrack,
            mbaSpecialization: spec.key,
            jobRole: shouldAutoJobRole
              ? mbaRoles[0] || "Management Trainee"
              : prev.jobRole,
            focusArea: mbaFocusAreas[0] || "Consumer behavior",
          };
        }

        const knownMbaRoles = MBA_SPECIALIZATIONS.flatMap((s) =>
          getMbaJobRoleSuggestions(s.key),
        );
        const isLikelyMbaRole = knownMbaRoles.includes(prev.jobRole);

        return {
          ...prev,
          track: nextTrack,
          jobRole: isLikelyMbaRole ? "Software Engineer" : prev.jobRole,
          focusArea: "behavioral",
        };
      }

      if (field === "mbaSpecialization") {
        const spec = getMbaSpecialization(String(value || ""));
        const mbaFocusAreas = getMbaFocusAreas(spec.key);
        const currentFocus = String(prev.focusArea || "");
        const nextFocus = mbaFocusAreas.includes(currentFocus)
          ? currentFocus
          : mbaFocusAreas[0] || "Consumer behavior";

        return {
          ...prev,
          mbaSpecialization: spec.key,
          focusArea: prev.track === "mba" ? nextFocus : prev.focusArea,
        };
      }

      return { ...prev, [field]: value };
    });
  };

  const toggleListening = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (isListening) {
      stopSpeechRecognition();
    } else {
      try {
        // Start a fresh STT session using currentAnswer as base, to avoid duplication.
        const base = normalizeText(currentAnswer);
        sttSessionRef.current.final = base;
        sttSessionRef.current.interim = "";
        shouldListenRef.current = true;
        rec.start();
        setIsListening(true);
      } catch {
        setIsListening(true);
      }
    }
  };

  // Also detect "I don't know" when user types (not only via STT)
  useEffect(() => {
    if (interviewStage !== "interview") return;
    const text = normalizeText(currentAnswer);
    if (!text) return;
    if (lastHelpQuestionIndexRef.current === currentQuestionIndex) return;
    if (
      /\b(idk|i\s*(do\s*not|don't)\s*know|i\s*dont\s*know|dont\s*know|no\s*idea|not\s*sure|can't\s*answer|cannot\s*answer)\b/i.test(
        text,
      )
    ) {
      provideInstantHelp("typed");
    }
  }, [currentAnswer, currentQuestionIndex, interviewStage]);

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const useBank = isBuiltInCompany(interviewDetails.company);
      const token = localStorage.getItem("token");
      const response = await fetchWithWarmupRetry(
        "/api/interview/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            company: interviewDetails.company,
            jobRole: interviewDetails.jobRole,
            level: interviewDetails.level,
            focusArea: interviewDetails.focusArea,
            track: interviewDetails.track,
            mbaSpecialization: interviewDetails.mbaSpecialization,
            ...(useBank ? {} : { count: 5 }),
          }),
        },
        { retries: 1 },
      );

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          errText || `Failed to fetch questions (${response.status})`,
        );
      }

      const data = await response.json();
      const qs = Array.isArray(data?.questions) ? data.questions : [];
      if (!qs.length) throw new Error("No questions received");

      if (!isMicOn) await startMic();

      setQuestions(qs);
      setInterviewStage("interview");
      setAssistantHelp(null);
      setAnswerCheck(null);
      setAnswerStructure(
        qs[0] ? buildAnswerStructure(getQuestionText(qs[0])) : null,
      );
      setShowIdealAnswer(false);
      lastHelpQuestionIndexRef.current = -1;
      lastCheckedAnswerRef.current = "";

      // Speak first question immediately after starting (user gesture context)
      if (autoPlayVoice) speakQuestion(getQuestionText(qs[0]));
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to start voice interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) {
      provideInstantHelp("empty");
      return;
    }

    // First click: check the answer (instant coaching). Second click: proceed.
    const normalized = normalizeText(currentAnswer);
    const alreadyChecked =
      answerCheck &&
      answerCheck.index === currentQuestionIndex &&
      normalizeText(answerCheck.answer) === normalized &&
      lastCheckedAnswerRef.current === normalized;

    if (!alreadyChecked) {
      void checkCurrentAnswer();
      return;
    }

    // Save per-question history on submit.
    try {
      const qText = getQuestionText(questions[currentQuestionIndex]);
      const normalizedAnswer = normalizeText(currentAnswer);
      persistPerQuestionHistory({
        score:
          typeof answerCheck?.score === "number"
            ? answerCheck.score
            : undefined,
        text:
          `Q${currentQuestionIndex + 1}: ${qText}\n` +
          `A: ${normalizedAnswer}\n` +
          (answerCheck?.verdict ? `Verdict: ${answerCheck.verdict}\n` : "") +
          (typeof answerCheck?.score === "number"
            ? `Score: ${answerCheck.score}/10\n\n`
            : "\n") +
          String(answerCheck?.feedback || "").trim(),
      });
    } catch {
      // ignore
    }

    const updated = [...answers];
    updated[currentQuestionIndex] = currentAnswer;
    setAnswers(updated);
    setCurrentAnswer("");
    setAssistantHelp(null);
    setAnswerCheck(null);
    lastCheckedAnswerRef.current = "";
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setAssistantHelp(null);
      setAnswerCheck(null);
      setShowIdealAnswer(false);
      // Speak next question during the click gesture (more reliable than autoplay)
      if (autoPlayVoice) speakQuestion(getQuestionText(questions[nextIndex]));
    }
  };

  const generateFeedback = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          company: interviewDetails.company,
          jobRole: interviewDetails.jobRole,
          level: interviewDetails.level,
          focusArea: interviewDetails.focusArea,
          track: interviewDetails.track,
          mbaSpecialization: interviewDetails.mbaSpecialization,
          questions: questions.map(getQuestionText),
          answers,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          errText || `Failed to fetch feedback (${response.status})`,
        );
      }

      const data = await response.json();
      const generatedFeedback = data?.feedback || "No feedback generated";
      setFeedback(generatedFeedback);
      appendFeedbackToHistory(generatedFeedback);
      setInterviewStage("feedback");
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback(
        "Failed to generate feedback. Here's a basic analysis:\n\n" +
          questions
            .map(
              (q, i) =>
                `Q${i + 1}: ${getQuestionText(q)}\nA: ${answers[i] || "No answer"}\n`,
            )
            .join("\n"),
      );
      setInterviewStage("feedback");
    } finally {
      setIsLoading(false);
      stopMic();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] bg-transparent text-slate-900 dark:bg-gray-900 dark:text-gray-100 p-4 md:p-6 radial-background">
      <div className="max-w-4xl mx-auto">
        {interviewStage === "setup" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Voice Interview
            </h1>

            <div className="grid gap-4 mb-6">
              <div>
                <label className="block mb-2 text-gray-300">
                  Company (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google, Amazon"
                  value={interviewDetails.company}
                  onChange={(e) =>
                    handleDetailChange("company", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Job Role</label>
                <input
                  type="text"
                  placeholder={
                    interviewDetails.track === "mba"
                      ? "e.g. Management Trainee"
                      : "e.g. Frontend Developer"
                  }
                  value={interviewDetails.jobRole}
                  onChange={(e) =>
                    handleDetailChange("jobRole", e.target.value)
                  }
                  list={
                    interviewDetails.track === "mba"
                      ? "mba-job-roles-voice"
                      : undefined
                  }
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                {interviewDetails.track === "mba" && (
                  <datalist id="mba-job-roles-voice">
                    {getMbaJobRoleSuggestions(
                      interviewDetails.mbaSpecialization,
                    ).map((r) => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>
                )}
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  Experience Level
                </label>
                <select
                  value={interviewDetails.level}
                  onChange={(e) => handleDetailChange("level", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  Candidate Type
                </label>
                <select
                  value={interviewDetails.track}
                  onChange={(e) => handleDetailChange("track", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="tech">Tech / Software</option>
                  <option value="mba">MBA</option>
                </select>
              </div>

              {interviewDetails.track === "mba" && (
                <div>
                  <label className="block mb-2 text-gray-300">
                    MBA Specialization
                  </label>
                  <select
                    value={interviewDetails.mbaSpecialization}
                    onChange={(e) =>
                      handleDetailChange("mbaSpecialization", e.target.value)
                    }
                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    {MBA_SPECIALIZATIONS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-300">
                    {
                      getMbaSpecialization(interviewDetails.mbaSpecialization)
                        ?.interviewLine
                    }
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-2 text-gray-300">Focus Area</label>
                <select
                  value={interviewDetails.focusArea}
                  onChange={(e) =>
                    handleDetailChange("focusArea", e.target.value)
                  }
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {interviewDetails.track === "mba" ? (
                    getMbaFocusAreas(interviewDetails.mbaSpecialization).map(
                      (fa) => (
                        <option key={fa} value={fa}>
                          {fa}
                        </option>
                      ),
                    )
                  ) : (
                    <>
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="system-design">System Design</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="bg-gray-700 rounded border border-gray-600 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-gray-300 text-sm">
                  Microphone: {isMicOn ? "On" : "Off"}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={startMic}
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                  >
                    Start Mic
                  </button>
                  <button
                    onClick={stopMic}
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                  >
                    Stop
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  onClick={isMonitoring ? stopMonitoring : startMonitoring}
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                >
                  {isMonitoring ? "Stop Hearing" : "Hear My Voice"}
                </button>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
              </div>

              <audio ref={monitorAudioRef} className="hidden" />

              {recordedUrl && (
                <div className="mt-3">
                  <div className="text-gray-300 text-sm mb-1">
                    Last recording (playback):
                  </div>
                  <audio controls src={recordedUrl} className="w-full" />
                </div>
              )}

              {permissionError && (
                <div className="text-red-300 text-sm mt-2">
                  {permissionError}
                </div>
              )}
              <p className="text-gray-400 text-sm mt-2">
                Optional: If your browser supports it, you can use
                speech-to-text during the interview.
              </p>
            </div>

            <button
              onClick={generateQuestions}
              disabled={isLoading}
              className="w-full bg-blue-600 py-3 rounded hover:bg-blue-500 disabled:opacity-50 transition-colors font-medium"
            >
              {isLoading ? "Starting..." : "Start Voice Interview"}
            </button>
          </div>
        )}

        {interviewStage === "interview" && questions.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <div className="text-gray-400 text-sm">
                {interviewDetails.jobRole} ({interviewDetails.level})
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded mb-6 min-h-24 border border-gray-600">
              <p className="text-lg">
                {getQuestionText(questions[currentQuestionIndex])}
              </p>
            </div>

            {(() => {
              const item = questions[currentQuestionIndex];
              const ideal = getIdealAnswer(item);
              const refs = getReferences(item);
              if (!ideal) return null;

              return (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setShowIdealAnswer((s) => !s)}
                    className="text-sm px-3 py-2 rounded bg-gray-700 border border-gray-600 hover:bg-gray-600 transition"
                  >
                    {showIdealAnswer ? "Hide" : "Show"} Reference Answer (with
                    GFG links)
                  </button>
                  {showIdealAnswer && (
                    <div className="mt-3 bg-gray-700 p-4 rounded border border-gray-600">
                      {refs.length > 0 && (
                        <div className="mb-3 text-sm text-gray-200">
                          <div className="font-semibold mb-1">
                            References (Options)
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {refs.slice(0, 2).map((r, idx) => (
                              <a
                                key={`${idx}-${r?.url || "ref"}`}
                                href={String(r?.url || "#")}
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-blue-300 hover:text-blue-200"
                              >
                                {String(r?.label || `Option ${idx + 1}`)}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="text-sm text-gray-100 whitespace-pre-wrap">
                        {ideal}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="mb-4 flex gap-3">
              <button
                onClick={() =>
                  speakQuestion(
                    getQuestionText(questions[currentQuestionIndex]),
                  )
                }
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                {isSpeaking ? "Speaking..." : "Speak Question"}
              </button>
              <button
                onClick={stopSpeaking}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Stop Voice
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                {isRecording ? "Stop Rec" : "Record"}
              </button>

              <button
                onClick={toggleListening}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                {isListening ? "Stop Speech" : "Start Speech"}
              </button>
              <button
                onClick={() => setCurrentAnswer("")}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Clear
              </button>
            </div>

            {recordedUrl && (
              <div className="mb-4 bg-gray-700 p-3 rounded border border-gray-600">
                <div className="text-gray-300 text-sm mb-1">
                  Last recording (playback):
                </div>
                <audio controls src={recordedUrl} className="w-full" />
              </div>
            )}

            {answerStructure && (
              <div className="mb-4 bg-gray-700 p-4 rounded border border-purple-500/40">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="text-purple-300 font-semibold">
                      Answer Structure
                    </div>
                    <div className="text-gray-300 text-xs">
                      {answerStructure.title}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const template = String(answerStructure.template || "");
                        if (!template.trim()) return;

                        setCurrentAnswer((prev) => {
                          const next =
                            prev && String(prev).trim().length
                              ? `${prev}\n\n${template}`
                              : template;
                          sttSessionRef.current.final = next;
                          sttSessionRef.current.interim = "";
                          return next;
                        });
                      }}
                      className="bg-purple-600 px-3 py-2 rounded hover:bg-purple-500 transition-colors text-sm"
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          `${answerStructure.title}. ${answerStructure.template}`,
                        )
                      }
                      className="bg-purple-600 px-3 py-2 rounded hover:bg-purple-500 transition-colors text-sm"
                    >
                      Speak
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswerStructure(null)}
                      className="bg-gray-600 px-3 py-2 rounded hover:bg-gray-500 transition-colors text-sm"
                    >
                      Hide
                    </button>
                  </div>
                </div>

                <pre className="whitespace-pre-wrap font-sans text-gray-100 text-sm bg-gray-800/50 p-3 rounded border border-gray-600">
                  {answerStructure.template}
                </pre>
              </div>
            )}

            {assistantHelp && (
              <div className="mb-4 bg-gray-700 p-4 rounded border border-blue-500/40">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="text-blue-300 font-semibold">
                      Instant Help
                    </div>
                    <div className="text-gray-300 text-xs">
                      Approach + sample answer (auto-filled below)
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          `${assistantHelp.spokenText} Here's a sample answer. ${assistantHelp.sampleAnswer}`,
                        )
                      }
                      className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-500 transition-colors text-sm"
                    >
                      Speak
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssistantHelp(null)}
                      className="bg-gray-600 px-3 py-2 rounded hover:bg-gray-500 transition-colors text-sm"
                    >
                      Hide
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-gray-300 text-sm mb-1">Approach</div>
                  <pre className="whitespace-pre-wrap font-sans text-gray-100 text-sm bg-gray-800/50 p-3 rounded border border-gray-600">
                    {assistantHelp.approach}
                  </pre>
                </div>

                <div>
                  <div className="text-gray-300 text-sm mb-1">
                    Sample Answer
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-gray-100 text-sm bg-gray-800/50 p-3 rounded border border-gray-600">
                    {assistantHelp.sampleAnswer}
                  </pre>
                </div>
              </div>
            )}

            {answerCheck && answerCheck.index === currentQuestionIndex && (
              <div className="mb-4 bg-gray-700 p-4 rounded border border-green-500/40">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="text-green-300 font-semibold">
                      Answer Check
                    </div>
                    <div className="text-gray-300 text-xs">
                      {answerCheck.source === "ai" ? "AI" : "Coach"} feedback
                      for your answer
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => speakText(answerCheck.feedback)}
                      className="bg-green-600 px-3 py-2 rounded hover:bg-green-500 transition-colors text-sm"
                      disabled={isChecking}
                    >
                      Speak
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Allow re-check after edits
                        setAnswerCheck(null);
                        lastCheckedAnswerRef.current = "";
                      }}
                      className="bg-gray-600 px-3 py-2 rounded hover:bg-gray-500 transition-colors text-sm"
                      disabled={isChecking}
                    >
                      Recheck
                    </button>
                  </div>
                </div>

                {answerCheck?.verdict && (
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs ${verdictStyles(
                        answerCheck.verdict,
                      )}`}
                    >
                      Verdict: {String(answerCheck.verdict)}
                    </span>
                    {typeof answerCheck?.score === "number" && (
                      <span className="ml-2 text-gray-200 text-xs">
                        Score: {answerCheck.score}/10
                      </span>
                    )}
                  </div>
                )}

                {answerCheck?.warning && (
                  <div className="text-yellow-200 text-xs mb-2">
                    {String(answerCheck.warning)}
                  </div>
                )}

                {answerCheck?.encouragement && (
                  <div className="text-gray-100 text-sm mb-3">
                    {String(answerCheck.encouragement)}
                  </div>
                )}

                {Array.isArray(answerCheck?.resources) &&
                  answerCheck.resources.length > 0 && (
                    <div className="mb-4">
                      <div className="text-gray-200 text-sm mb-1">
                        Recommended sources
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm">
                        {answerCheck.resources.slice(0, 3).map((r, idx) => (
                          <a
                            key={`res-${idx}-${r?.url || ""}`}
                            href={String(r?.url || "#")}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-blue-300 hover:text-blue-200"
                          >
                            {String(r?.label || `Source ${idx + 1}`)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {(Array.isArray(answerCheck?.good) ||
                  Array.isArray(answerCheck?.improve)) && (
                  <div className="space-y-3">
                    {Array.isArray(answerCheck?.good) &&
                      answerCheck.good.length > 0 && (
                        <div>
                          <div className="text-gray-200 text-sm mb-1">
                            What’s good
                          </div>
                          <ul className="text-gray-100 text-sm list-disc pl-5 space-y-1">
                            {answerCheck.good.slice(0, 3).map((item, idx) => (
                              <li key={`good-${idx}`}>{String(item)}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {Array.isArray(answerCheck?.improve) &&
                      answerCheck.improve.length > 0 && (
                        <div>
                          <div className="text-gray-200 text-sm mb-1">
                            What to improve
                          </div>
                          <ul className="text-gray-100 text-sm list-disc pl-5 space-y-1">
                            {answerCheck.improve
                              .slice(0, 3)
                              .map((item, idx) => (
                                <li key={`imp-${idx}`}>{String(item)}</li>
                              ))}
                          </ul>
                        </div>
                      )}

                    {Array.isArray(answerCheck?.keyMissing) &&
                      answerCheck.keyMissing.length > 0 && (
                        <div>
                          <div className="text-gray-200 text-sm mb-1">
                            Key missing points
                          </div>
                          <ul className="text-gray-100 text-sm list-disc pl-5 space-y-1">
                            {answerCheck.keyMissing
                              .slice(0, 2)
                              .map((item, idx) => (
                                <li key={`miss-${idx}`}>{String(item)}</li>
                              ))}
                          </ul>
                        </div>
                      )}

                    {answerCheck?.improvedAnswer && (
                      <div>
                        <div className="text-gray-200 text-sm mb-1">
                          Suggested improved answer
                        </div>
                        <pre className="whitespace-pre-wrap font-sans text-gray-100 text-sm bg-gray-800/50 p-3 rounded border border-gray-600">
                          {String(answerCheck.improvedAnswer)}
                        </pre>
                      </div>
                    )}

                    {answerCheck?.oneLinerTip && (
                      <div className="text-gray-200 text-sm">
                        <span className="text-gray-300">One-liner tip:</span>{" "}
                        {String(answerCheck.oneLinerTip)}
                      </div>
                    )}
                  </div>
                )}

                {!Array.isArray(answerCheck?.good) &&
                  !Array.isArray(answerCheck?.improve) && (
                    <pre className="whitespace-pre-wrap font-sans text-gray-100 text-sm bg-gray-800/50 p-3 rounded border border-gray-600">
                      {isChecking
                        ? "Checking your answer..."
                        : answerCheck.feedback}
                    </pre>
                  )}

                <div className="text-gray-300 text-xs mt-2">
                  Tip: Click Submit Answer once to check, and again to continue.
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Your Answer:</label>
              <textarea
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                rows={6}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type (or speak) your answer here..."
              />
            </div>

            <div className="flex justify-between gap-4">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => {
                    const prevIndex = currentQuestionIndex - 1;
                    setCurrentQuestionIndex(prevIndex);
                    setShowIdealAnswer(false);
                    speakQuestion(getQuestionText(questions[prevIndex]));
                  }}
                  className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-500 transition-colors"
                >
                  Previous
                </button>
              )}

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={submitAnswer}
                  className={`flex-1 bg-blue-600 py-2 rounded hover:bg-blue-500 transition-colors ${
                    currentQuestionIndex > 0 ? "" : "ml-auto"
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={generateFeedback}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 py-2 rounded hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Generating Feedback..." : "Submit Final Answer"}
                </button>
              )}
            </div>
          </div>
        )}

        {interviewStage === "feedback" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Interview Feedback
            </h1>

            <div className="bg-gray-700 p-4 rounded mb-6 border border-gray-600">
              <pre className="whitespace-pre-wrap font-sans">{feedback}</pre>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setInterviewStage("setup");
                  setQuestions([]);
                  setAnswers([]);
                  setCurrentQuestionIndex(0);
                  setFeedback("");
                }}
                className="flex-1 bg-blue-600 py-3 rounded hover:bg-blue-500 transition-colors font-medium"
              >
                New Interview
              </button>

              <button
                onClick={() => {
                  setInterviewStage("interview");
                  setCurrentQuestionIndex(0);
                }}
                className="flex-1 bg-gray-600 py-3 rounded hover:bg-gray-500 transition-colors font-medium"
              >
                Review Answers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInterview;
