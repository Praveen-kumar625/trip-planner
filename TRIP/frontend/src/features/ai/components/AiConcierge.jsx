import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useAiStore } from '../../../store/aiStore';
import { aiService } from '../../../services/api/ai.service';

export const AiConcierge = () => {
  const { isOpen, messages, isThinking, toggleOpen, addMessage, updateLastMessage, setThinking } = useAiStore();
  const [input, setInput] = useState('');
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

    // Add empty assistant message for streaming
    addMessage({ role: 'assistant', content: '' });

    try {
      await aiService.streamChat(
        { message: userMessage.content, history: messages },
        (data) => {
          // Check for structured JSON or raw text
          if (data.type === 'token') {
            updateLastMessage(data.text);
          } else if (data.data) {
            // Handle structured response chunk if applicable
            updateLastMessage(typeof data.data === 'string' ? data.data : JSON.stringify(data.data));
          } else if (data.content) {
             updateLastMessage(data.content);
          }
        },
        (error) => {
          console.error('Chat error:', error);
          updateLastMessage('\n\n*Sorry, I encountered an error connecting to the intelligence core.*');
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

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-indigo-600 text-white">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">WanderSync AI</h3>
              </div>
              <button onClick={toggleOpen} className="p-1 hover:bg-indigo-500 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 dark:text-slate-400 mt-10">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                  <p>How can I help you plan your next journey?</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-sm flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your trip..."
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
