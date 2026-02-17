/**
 * Charlotte Voice Agent — PWA Client
 * ====================================
 * WebSocket client with push-to-talk audio and text input.
 */

(function () {
    "use strict";

    // ---- DOM ----
    const messagesEl = document.getElementById("messages");
    const textInput = document.getElementById("text-input");
    const sendBtn = document.getElementById("send-btn");
    const micBtn = document.getElementById("mic-btn");
    const micLabel = document.getElementById("mic-label");
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const conversationEl = document.getElementById("conversation");

    // ---- State ----
    let ws = null;
    let audioContext = null;
    let mediaStream = null;
    let recorder = null;
    let isRecording = false;
    let audioQueue = [];
    let isPlayingAudio = false;

    // ---- Auth ----
    function getToken() {
        let token = localStorage.getItem("charlotte-token");
        if (!token) {
            token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
            localStorage.setItem("charlotte-token", token);
        }
        return token;
    }

    // ---- WebSocket ----
    function connect() {
        const proto = location.protocol === "https:" ? "wss:" : "ws:";
        const url = `${proto}//${location.host}/app/ws?token=${getToken()}`;
        ws = new WebSocket(url);

        ws.onopen = () => {
            setStatus("connected", "Connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleMessage(data);
        };

        ws.onclose = () => {
            setStatus("error", "Disconnected");
            // Reconnect after 3 seconds
            setTimeout(connect, 3000);
        };

        ws.onerror = () => {
            setStatus("error", "Connection error");
        };
    }

    function handleMessage(data) {
        switch (data.type) {
            case "history":
                // Load conversation history
                messagesEl.innerHTML = "";
                (data.messages || []).forEach((m) => {
                    addMessage(m.role, m.content);
                });
                scrollToBottom();
                break;

            case "transcript":
                if (data.is_final) {
                    removeInterim();
                    addMessage("user", data.text);
                } else {
                    showInterim(data.text);
                }
                break;

            case "response":
                addMessage("assistant", data.text);
                scrollToBottom();
                break;

            case "audio":
                if (data.data && !data.final) {
                    queueAudio(data.data);
                }
                if (data.final) {
                    playQueuedAudio();
                }
                break;

            case "status":
                const labels = {
                    listening: "Listening...",
                    thinking: "Thinking...",
                    tool: `Using ${data.tool || "tool"}...`,
                    speaking: "Speaking...",
                    idle: "Connected",
                };
                setStatus(data.status, labels[data.status] || data.status);
                break;

            case "error":
                addMessage("system", data.message || "An error occurred.");
                break;
        }
    }

    // ---- UI ----
    function setStatus(state, label) {
        statusDot.className = "dot " + state;
        statusText.textContent = label;
    }

    function addMessage(role, content) {
        const div = document.createElement("div");
        div.className = "message " + role;
        div.textContent = content;
        messagesEl.appendChild(div);
        scrollToBottom();
    }

    function showInterim(text) {
        removeInterim();
        const div = document.createElement("div");
        div.className = "message user interim";
        div.id = "interim";
        div.textContent = text;
        messagesEl.appendChild(div);
        scrollToBottom();
    }

    function removeInterim() {
        const el = document.getElementById("interim");
        if (el) el.remove();
    }

    function scrollToBottom() {
        conversationEl.scrollTop = conversationEl.scrollHeight;
    }

    // ---- Text Input ----
    function sendText() {
        const text = textInput.value.trim();
        if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;
        ws.send(JSON.stringify({ type: "text", text: text }));
        addMessage("user", text);
        textInput.value = "";
    }

    sendBtn.addEventListener("click", sendText);
    textInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendText();
        }
    });

    // ---- Push-to-Talk ----
    async function startRecording() {
        if (isRecording) return;
        isRecording = true;
        micBtn.classList.add("active");
        micLabel.textContent = "Listening...";

        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)({
                    sampleRate: 16000,
                });
            }

            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            // Tell server to start STT
            ws.send(JSON.stringify({ type: "audio_start" }));

            // Process audio with ScriptProcessor (widely supported)
            const source = audioContext.createMediaStreamSource(mediaStream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
                if (!isRecording || !ws || ws.readyState !== WebSocket.OPEN) return;
                const float32 = e.inputBuffer.getChannelData(0);
                // Convert float32 to int16 PCM
                const int16 = new Int16Array(float32.length);
                for (let i = 0; i < float32.length; i++) {
                    const s = Math.max(-1, Math.min(1, float32[i]));
                    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                // Send as base64
                const b64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
                ws.send(JSON.stringify({ type: "audio_data", data: b64 }));
            };

            source.connect(processor);
            processor.connect(audioContext.destination);
            recorder = { source, processor, stream: mediaStream };

        } catch (err) {
            console.error("Mic error:", err);
            addMessage("system", "Microphone access denied or unavailable.");
            stopRecording();
        }
    }

    function stopRecording() {
        isRecording = false;
        micBtn.classList.remove("active");
        micLabel.textContent = "Hold to speak";

        if (recorder) {
            recorder.processor.disconnect();
            recorder.source.disconnect();
            recorder.stream.getTracks().forEach((t) => t.stop());
            recorder = null;
        }

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "audio_stop" }));
        }
    }

    // Touch events for push-to-talk
    micBtn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        startRecording();
    });
    micBtn.addEventListener("pointerup", (e) => {
        e.preventDefault();
        stopRecording();
    });
    micBtn.addEventListener("pointerleave", (e) => {
        if (isRecording) stopRecording();
    });

    // ---- Audio Playback ----
    function queueAudio(b64) {
        audioQueue.push(b64);
    }

    async function playQueuedAudio() {
        if (audioQueue.length === 0 || isPlayingAudio) return;
        isPlayingAudio = true;

        // Combine all chunks into one blob
        const chunks = audioQueue.splice(0);
        const bytes = [];
        for (const b64 of chunks) {
            const binary = atob(b64);
            const arr = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                arr[i] = binary.charCodeAt(i);
            }
            bytes.push(arr);
        }
        const blob = new Blob(bytes, { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio.onended = () => {
            URL.revokeObjectURL(url);
            isPlayingAudio = false;
        };
        audio.onerror = () => {
            URL.revokeObjectURL(url);
            isPlayingAudio = false;
        };

        try {
            await audio.play();
        } catch (err) {
            console.warn("Audio play failed:", err);
            isPlayingAudio = false;
        }
    }

    // ---- Service Worker ----
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js").catch(() => {});
    }

    // ---- Init ----
    connect();
})();
