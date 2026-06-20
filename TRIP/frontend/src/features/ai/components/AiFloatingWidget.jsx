import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2, MessageCircle, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/components/ui/Layout';
import { useAiStore } from '@/store/aiStore';
import { aiService } from '@/services/api/ai.service';
import { useAuthStore } from '@/store/authStore';
import { useVoice } from '@/hooks/useVoice';

export default function AiFloatingWidget() {
  const { isOpen, setOpen, messages, addMessage, setThinking, isThinking, clearChat } = useAiStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    isListening,
    interimTranscript,
    finalTranscript,
    setFinalTranscript,
    error,
    startListening,
    stopListening,
    isSupported
  } = useVoice();

  useEffect(() => {
    if (finalTranscript) {
      setInput((prev) => prev + (prev ? ' ' : '') + finalTranscript);
      setFinalTranscript('');
    }
  }, [finalTranscript, setFinalTranscript]);

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query || isThinking) return;

    setInput('');
    addMessage({ role: 'user', content: query });
    setThinking(true);
    addMessage({ role: 'assistant', content: '' });

    try {
      const { updateLastMessage, setLastStructuredResponse, messages: currentHistory } = useAiStore.getState();
      await aiService.streamChat(
        { message: query, sessionId: 'floating-widget', history: currentHistory.slice(0, -2) },
        (msg) => {
          if (msg.type === 'token') {
            updateLastMessage(msg.content);
          } else if (msg.type === 'structured') {
            setLastStructuredResponse(msg.data);
            updateLastMessage("\n\n✨ *I've updated the trip plan behind the scenes. Head to the AI Concierge page to view or save it.*");
          }
        },
        () => {
          updateLastMessage('\n\n*Sorry, I encountered an issue. Please try again.*');
        },
        () => setThinking(false)
      );
    } catch {
      setThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 w-14 h-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-premium flex items-center justify-center group border border-slate-800 dark:border-slate-200"
            aria-label="Open AI Concierge"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform text-primary-400 dark:text-primary-600" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse-slow" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 w-[calc(100vw-2rem)] md:w-[420px] max-h-[75vh] flex flex-col rounded-3xl overflow-hidden shadow-premium-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-primary-200 dark:border-primary-900/50 bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">WanderSync Advisor</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Concierge</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[200px] max-h-[400px] scrollbar-hide">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full border border-primary-100 dark:border-primary-900/50 bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary-500" />
                  </div>
                  <p className="text-sm font-serif font-bold text-slate-900 dark:text-white mb-2">How can I assist you?</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-[80%] mx-auto leading-relaxed">Ask me about destinations, hidden gems, or itinerary adjustments.</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    'max-w-[85%] px-5 py-3.5 rounded-[1.5rem] text-sm leading-relaxed prose prose-sm max-w-none shadow-sm',
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white rounded-br-sm dark:bg-slate-100 dark:text-slate-900 prose-invert dark:prose-slate'
                      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm dark:prose-invert'
                  )}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative">
              {error && (
                <div className="mb-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1.5 rounded-md border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}
              {interimTranscript && (
                <div className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {interimTranscript}...
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message your advisor..."
                  className="flex-1 px-5 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={!isSupported}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isListening
                      ? 'bg-red-500 text-white ring-2 ring-red-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Toggle voice input"
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isThinking}
                  className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-slate-900 flex items-center justify-center transition-all shrink-0 shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
