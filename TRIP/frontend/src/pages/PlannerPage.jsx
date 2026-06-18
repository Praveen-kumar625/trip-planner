import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Bot, Plus } from 'lucide-react';
import { useAiStore } from '@/store/aiStore';
import { aiService } from '@/services/api/ai.service';
import { useTripGeneratorStore } from '@/hooks/useTripGenerator';
import { DestinationHeroInput } from '@/features/trips/components/DestinationHeroInput';
import { ProgressivePreferenceForm } from '@/features/trips/components/ProgressivePreferenceForm';
import { AiResearchOverlay } from '@/features/trips/components/AiResearchOverlay';

export function PlannerPage() {
  const { messages, isThinking, addMessage, updateLastMessage, setThinking, clearChat } = useAiStore();
  const [input, setInput] = useState('');
  const [showWizard, setShowWizard] = useState(true);
  const messagesEndRef = useRef(null);
  const store = useTripGeneratorStore();
  const resetWizard = store.reset;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Show wizard when there are no messages (fresh state)
  useEffect(() => {
    if (messages.length === 0) {
      setShowWizard(true);
    }
  }, [messages.length]);

  const handleWizardComplete = async (payload, prompt) => {
    setShowWizard(false);

    // Add the structured prompt as a user message
    const userMessage = { role: 'user', content: prompt };
    addMessage(userMessage);
    setThinking(true);
    addMessage({ role: 'assistant', content: '' });

    try {
      await aiService.streamChat(
        { message: prompt, tripContext: payload, history: [] },
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

  const handleNewTrip = () => {
    clearChat();
    resetWizard();
    setShowWizard(true);
  };

  // If AI is thinking on the very first prompt, show the premium research overlay
  if (isThinking && messages.length === 2 && messages[1].content === '') {
    return <AiResearchOverlay destinationName={store.destination?.city || store.destination?.formattedAddress} />;
  }

  // Wizard mode
  if (showWizard && messages.length === 0) {
    if (!store.destination) {
      return (
        <div className="w-full min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
          <DestinationHeroInput onDestinationSelect={(place) => store.setDestination(place)} />
        </div>
      );
    }

    return (
      <div className="w-full min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
        <ProgressivePreferenceForm 
          onComplete={handleWizardComplete} 
          onBack={() => store.setDestination(null)} 
        />
      </div>
    );
  }

  // Chat mode (after wizard submission or ongoing conversation)
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] max-w-5xl mx-auto w-full bg-slate-50 dark:bg-slate-950 p-0 md:p-6">
      <div className="flex-1 bg-white dark:bg-slate-900 md:rounded-2xl md:shadow-xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-4">
              <Bot className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">AI Trip Concierge</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your personal intelligent travel planner</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!showWizard && messages.length > 0 && (
              <button
                onClick={async () => {
                  const { createTrip } = (await import('@/store/tripStore')).useTripStore.getState();
                  const { user } = (await import('@/store/authStore')).useAuthStore.getState();
                  if (!user) return alert('Please login to save trips!');
                  
                  try {
                    const payload = useTripGeneratorStore.getState().generatePayload();
                    await createTrip({ 
                      ...payload, 
                      userId: user.uid,
                      itinerary: messages.map(m => m.content).join('\n\n') // Store AI context
                    });
                    alert('Trip saved successfully!');
                  } catch (e) {
                    alert('Failed to save trip.');
                    console.error(e);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-semibold text-sm hover:bg-amber-100 transition-colors border border-amber-200"
              >
                <Sparkles className="w-4 h-4" />
                Save Trip
              </button>
            )}
            <button
              onClick={handleNewTrip}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-semibold text-sm hover:bg-amber-100 transition-colors border border-amber-200"
            >
              <Plus className="w-4 h-4" />
              New Trip
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-white rounded-br-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-sm flex space-x-2 items-center">
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="flex-1 px-5 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-amber-500 dark:text-white outline-none shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
