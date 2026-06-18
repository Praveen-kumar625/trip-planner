import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Send, X, Maximize2, Minimize2 } from 'lucide-react';
import { useAiStore } from '@/store/aiStore';
import { aiService } from '@/services/api/ai.service';

/**
 * AiConcierge — Floating AI chat widget.
 * Available globally across all pages via RootLayout.
 * Enhanced with markdown-like rendering, expandable UI, and improved UX.
 */
export const AiConcierge = () => {
  const { isOpen, messages, isThinking, toggleOpen, addMessage, updateLastMessage, setThinking } = useAiStore();
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    addMessage(userMessage);
    setInput('');
    setThinking(true);
    addMessage({ role: 'assistant', content: '' });

    try {
      await aiService.streamChat(
        { message: userMessage.content, history: messages },
        (data) => {
          if (data.type === 'token') {
            updateLastMessage(data.text);
          } else if (data.data) {
            updateLastMessage(typeof data.data === 'string' ? data.data : JSON.stringify(data.data));
          } else if (data.content) {
            updateLastMessage(data.content);
          }
        },
        (error) => {
          console.error('Chat error:', error);
          updateLastMessage('\n\n*Sorry, I encountered an error. Please try again.*');
          setThinking(false);
        },
        () => {
          setThinking(false);
        }
      );
    } catch (e) {
      console.error(e);
      setThinking(false);
    }
  };

  const widgetSize = expanded
    ? 'w-[95vw] max-w-lg h-[85vh] md:h-[700px]'
    : 'w-[90vw] max-w-[380px] h-[60vh] md:h-[500px]';

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleOpen}
            className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 p-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 ${widgetSize} bg-white rounded-3xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden transition-all duration-300`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">WanderSync AI</h3>
                  <p className="text-xs text-neutral-500">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-white/60 rounded-xl transition-colors"
                >
                  {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleOpen}
                  className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-white/60 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {messages.length === 0 && (
                <div className="text-center text-neutral-400 mt-8 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-amber-400" />
                  <p className="font-medium text-neutral-600">How can I help?</p>
                  <p className="text-sm">Ask me about destinations, budgets, or itineraries.</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-white rounded-br-lg'
                        : 'bg-white text-neutral-800 border border-neutral-200 shadow-sm rounded-bl-lg'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-lg flex space-x-2 items-center border border-neutral-200 shadow-sm">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-neutral-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your trip..."
                  className="flex-1 px-4 py-3 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-amber-500/30 text-neutral-900 text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
