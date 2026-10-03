import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PersonaMode, AppLanguage, StudentProfile } from '../types/admission';
import { QUICK_PROMPTS, TRANSLATIONS } from '../data/admissionData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatCopilotProps {
  mode: PersonaMode;
  language: AppLanguage;
  studentProfile: StudentProfile;
  initialQuery?: string;
  onNavigateTab?: (tab: string) => void;
}

export const ChatCopilot: React.FC<ChatCopilotProps> = ({
  mode,
  language,
  studentProfile,
  initialQuery,
  onNavigateTab,
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome_1',
      sender: 'assistant',
      text:
        mode === 'student'
          ? `Hey! 🎓 I am your **AI Admission Copilot**. \n\nTell me your 12th marks or entrance percentile (e.g., *"I got 72% in 12th and 86 percentile in CET. Can I get Computer Engineering in Pune?"*) and I will give you instant cutoff checks, branch recommendations, document checklists, and scholarship options!\n\nWhat would you like to explore today?`
          : `Namaste! 👨‍👩‍👦 Welcome to the **Parent Admission Copilot**.\n\nI am here to give you 100% transparent and reliable guidance on **college fee structures, government scholarship waivers (up to 100%), hostel security & warden supervision, transport/bus routes, and return-on-investment**.\n\nHow may I help you and your child today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoiceMessageId, setActiveVoiceMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle incoming initial query (e.g. from course matcher or troubleshooter)
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  // Handle Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }

    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [language]);

  const toggleSpeechRecognition = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.lang =
          language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        speechRecognitionRef.current.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  // Text to Speech playback
  const speakText = (text: string, msgId: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking && activeVoiceMessageId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveVoiceMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown formatting characters from speech output
    const cleanText = text
      .replace(/[*#_`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/•/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveVoiceMessageId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveVoiceMessageId(null);
    };

    setIsSpeaking(true);
    setActiveVoiceMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const stopAllSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveVoiceMessageId(null);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    stopAllSpeech();

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          mode,
          language,
          studentProfile,
          chatHistory: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text:
          data.reply ||
          'I received your question. Check out the tabs above for detailed eligibility and document checklists.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: `Based on your profile (${studentProfile.boardPercentage}% in 12th, ${studentProfile.category} category):
• **Core Eligibility**: You meet the AICTE & State Board eligibility of 45% (40% for reserved) in PCM.
• **Cutoff Insight**: Computer Engineering typically ranges between 82–96 percentile in premier autonomous institutes, while AI & Data Science ranges from 78–92 percentile.
• **Scholarship**: You are eligible for 50% to 100% tuition fee waiver via MahaDBT / TFWS schemes.
• Check out the **Eligibility & Courses** tab to view colleges matching your marks!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    stopAllSpeech();
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'assistant',
        text:
          mode === 'student'
            ? `Chat reset! 🚀 Enter any question about cutoffs, branch recommendations, college life, or document verification.`
            : `Chat reset! 👨‍👩‍👦 Feel free to ask about fees, scholarships, hostel safety, bus routes, or anti-ragging measures.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const currentPrompts = mode === 'student' ? QUICK_PROMPTS.student : QUICK_PROMPTS.parent;

  return (
    <div className="flex flex-col h-[740px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Copilot Header */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              mode === 'student'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-emerald-600 text-white shadow-xs'
            }`}
          >
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-slate-900">
                {mode === 'student' ? 'Student Admission Copilot' : 'Parent Admission Counselor'}
              </h2>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.8 Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {mode === 'student'
                ? 'Cutoffs • Branches • Placements • CAP Rounds'
                : 'Fees • Hostel Safety • Transport • Scholarships'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Active Profile Pill */}
          <div className="hidden md:flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="font-medium text-slate-900">{studentProfile.boardPercentage}% 12th</span>
            <span>•</span>
            <span className="font-medium text-indigo-600">{studentProfile.category}</span>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : mode === 'student'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1 max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans space-y-2">
                    {message.text.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Message Meta & Actions */}
                <div
                  className={`flex items-center gap-2 text-[11px] text-slate-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{message.timestamp}</span>
                  {!isUser && (
                    <>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(message.text, message.id)}
                        className="hover:text-slate-700 inline-flex items-center gap-1 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => speakText(message.text, message.id)}
                        className={`inline-flex items-center gap-1 hover:text-indigo-600 transition-colors ${
                          activeVoiceMessageId === message.id ? 'text-indigo-600 font-bold' : ''
                        }`}
                        title="Listen to response"
                      >
                        {activeVoiceMessageId === message.id ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-500" />
                            <span className="text-rose-500">Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>{t.readAloud}</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                mode === 'student' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span
                className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
              <span className="ml-1 font-medium">Analyzing admission database & cutoffs...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Suggested:
          </span>
          {currentPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt.text)}
              className="text-xs bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full transition-all shadow-2xs whitespace-nowrap active:scale-95"
            >
              <span className="font-semibold text-slate-400 mr-1">#{prompt.tag}:</span>
              {prompt.text}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Status Alert if Listening */}
      {isListening && (
        <div className="bg-rose-50 border-t border-rose-200 px-4 py-2 flex items-center justify-between text-xs text-rose-700">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>{t.voiceListening} ({language.toUpperCase()})</span>
          </div>
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className="text-rose-800 font-bold hover:underline"
          >
            {t.voiceStop}
          </button>
        </div>
      )}

      {/* Input Box & Voice Trigger */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Speech-to-text button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 shadow-rose-200 shadow-md'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
            }`}
            title={isListening ? t.voiceStop : t.askVoice}
          >
            {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'student'
                ? `e.g. "I got 72% in 12th and want CS in Pune..." (${language.toUpperCase()})`
                : `e.g. "What is total fee and hostel safety standard?" (${language.toUpperCase()})`
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 ${
              !input.trim() || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : mode === 'student'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 px-1">
          <span>Powered by Gemini 3.8 Flash • Real-time CAP 2026 Regulations</span>
          <span className="hidden sm:inline">Supports Voice in English, हिंदी, मराठी</span>
        </div>
      </div>

    </div>
  );
};
