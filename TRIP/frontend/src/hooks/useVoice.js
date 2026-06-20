import { useState, useEffect, useRef, useCallback } from 'react';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentFinal += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (currentFinal) {
            setFinalTranscript(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + currentFinal.trim());
          }
          setInterimTranscript(currentInterim);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone access denied. Please allow access in your browser settings.');
          } else if (event.error === 'network') {
            setError('Network error: Your browser could not reach the speech recognition service. (Brave and some ad-blockers block this. Try Chrome or Edge.)');
          } else if (event.error !== 'no-speech') {
            setError(`Microphone error: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        setIsSupported(true);
      } else {
        setIsSupported(false);
        setError('Your browser does not support Voice AI. Try Chrome or Edge.');
      }
    }
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    if (!recognitionRef.current) {
      setError('Voice AI is not supported in this browser.');
      return;
    }
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error('Failed to start recording:', e);
      // Sometimes it's already started
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setInterimTranscript(''); // Clear interim when stopping
  }, []);

  const resetTranscript = useCallback(() => {
    setFinalTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    interimTranscript,
    finalTranscript,
    setFinalTranscript, // Expose setter so we can clear or modify it
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  };
}
