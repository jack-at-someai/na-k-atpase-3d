/**
 * Voice Interface — Web Speech API STT/TTS
 */
class VoiceInterface {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.onResult = null;
    this.onStateChange = null;
    this.continuous = false;

    this._initRecognition();
  }

  _initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript && this.onResult) {
        this.onResult(finalTranscript.trim());
      }

      if (interimTranscript && this.onInterim) {
        this.onInterim(interimTranscript);
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStateChange) this.onStateChange('listening');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStateChange) this.onStateChange('idle');
    };

    this.recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
      this.isListening = false;
      if (this.onStateChange) this.onStateChange('idle');
    };
  }

  startListening() {
    if (!this.recognition) return;
    if (this.isListening) return;

    // Cancel any ongoing TTS
    this.synthesis.cancel();

    try {
      this.recognition.start();
    } catch (e) {
      // Already started
    }
  }

  stopListening() {
    if (!this.recognition) return;
    if (!this.isListening) return;

    try {
      this.recognition.stop();
    } catch (e) {
      // Already stopped
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  speak(text) {
    if (!this.synthesis) return;

    // Cancel previous speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Prefer a natural-sounding voice
    const voices = this.synthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')
    ) || voices.find(v => v.lang === 'en-US') || voices[0];

    if (preferred) utterance.voice = preferred;

    if (this.onStateChange) this.onStateChange('speaking');

    utterance.onend = () => {
      if (this.onStateChange) this.onStateChange('idle');
    };

    this.synthesis.speak(utterance);
  }

  get isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
}
