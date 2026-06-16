import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([{ role: 'ai', content: 'Namaste. Where would you like to travel in India today?' }]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChat([...chat, { role: 'user', content: message }]);
    setMessage('');
    
    // Simulate AI thinking and response
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'ai', content: 'I am curating a beautiful journey for you based on that...' }]);
    }, 1000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="default" 
          size="icon" 
          className="rounded-full shadow-2xl shadow-(--md-sys-color-primary)/50 w-16 h-16 bg-(--md-sys-color-primary) text-white"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="w-8 h-8" />
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[400px] max-h-[600px] h-[80vh] bg-(--md-sys-color-surface) rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-(--md-sys-color-primary) p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-(--md-sys-color-accent)" />
                <span className="font-bold">Wandersync AI Concierge</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-(--md-sys-color-primary) text-white rounded-tr-none' 
                      : 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-tl-none border border-black/5 dark:border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-surface-900 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-800 rounded-2xl p-2">
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none px-2 text-surface-900 dark:text-surface-100 placeholder:text-surface-500"
                  placeholder="Ask about your trip..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button variant="default" size="icon" className="w-10 h-10 rounded-xl" onClick={handleSend}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
