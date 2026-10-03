import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { AppLanguage, PersonaMode } from '../types/admission';
import { TRANSLATIONS } from '../data/admissionData';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTranscript: (transcript: string) => void;
  language: AppLanguage;
  mode: PersonaMode;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onSubmitTranscript,
  language,
  mode,
}) => {
  const t = TRANSLATIONS[language];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.error('Modal speech error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isOpen, language]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang =
          language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSend = () => {
    if (transcript.trim()) {
      onSubmitTranscript(transcript.trim());
      setTranscript('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative text-center">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          
          {/* Animated Mic Sphere */}
          <button
            type="button"
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
              isListening
                ? 'bg-rose-500 text-white shadow-rose-200 ring-8 ring-rose-100 animate-pulse'
                : 'bg-indigo-600 text-white shadow-indigo-200 hover:scale-105'
            }`}
          >
            {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <MicOff className="w-10 h-10" />}
          </button>

          <h3 className="mt-5 text-xl font-bold text-slate-900 font-display">
            {isListening ? t.voiceListening : 'Tap Microphone to Speak'}
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Language: <strong className="text-slate-800">{language === 'mr' ? 'मराठी (Marathi)' : language === 'hi' ? 'हिंदी (Hindi)' : 'English (India)'}</strong>
          </p>

          {/* Transcript Area */}
          <div className="mt-6 w-full min-h-24 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-sm text-slate-800 font-medium">
            {transcript ? (
              <p className="leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-slate-400 italic">
                {isListening
                  ? 'Speak clearly into your microphone... (e.g. "What is the cutoff for Computer Engineering at PICT Pune?")'
                  : 'Microphone is paused. Tap the icon above to resume speaking.'}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={() => setTranscript('')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={!transcript.trim()}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${
                !transcript.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : mode === 'student'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              }`}
            >
              <span>Ask AI Copilot Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
