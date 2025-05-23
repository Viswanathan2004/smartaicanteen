export class VoiceRecognition {
    constructor(options = {}) {
      this.recognition = null;
      this.options = {
        continuous: true,
        lang: 'en-US',
        ...options
      };
      this.isListening = false;
      
      this.initRecognition();
    }
    
    initRecognition() {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        if (this.options.onError) {
          this.options.onError('Speech recognition is not supported in this browser');
        }
        return;
      }
      
      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      // Set options
      this.recognition.continuous = this.options.continuous ?? true;
      this.recognition.lang = this.options.lang ?? 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      
      // Set event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.options.onStart) {
          this.options.onStart();
        }
      };
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (this.options.onResult) {
          this.options.onResult(transcript);
        }
      };
      
      this.recognition.onerror = (event) => {
        if (this.options.onError) {
          this.options.onError(event.error);
        }
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        if (this.options.onEnd) {
          this.options.onEnd();
        }
      };
    }
    
    start() {
      if (!this.recognition) {
        this.initRecognition();
        if (!this.recognition) return;
      }
      
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Speech recognition failed to start:', error);
        if (this.options.onError) {
          this.options.onError('Failed to start speech recognition');
        }
      }
    }
    
    stop() {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      }
    }
    
    isSupported() {
      return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
    }
    
    isActive() {
      return this.isListening;
    }
  }
  
  // Helper for making single recognition requests
  export async function recognizeSpeech(options = {}) {
    return new Promise((resolve, reject) => {
      const recognition = new VoiceRecognition({
        continuous: false,
        onResult: (transcript) => {
          resolve(transcript);
        },
        onError: (error) => {
          reject(new Error(error));
        },
        ...options
      });
      
      recognition.start();
      
      // Set a timeout to stop recognition after 10 seconds
      setTimeout(() => {
        if (recognition.isActive()) {
          recognition.stop();
          reject(new Error('Recognition timed out'));
        }
      }, 10000);
    });
  }