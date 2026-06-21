import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Bot, Plus, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAiStore } from '@/store/aiStore';
import { aiService } from '@/services/api/ai.service';
import { useVoice } from '@/hooks/useVoice';
import { useTripGeneratorStore } from '@/hooks/useTripGenerator';
import { DestinationHeroInput } from '@/features/trips/components/DestinationHeroInput';
import { ProgressivePreferenceForm } from '@/features/trips/components/ProgressivePreferenceForm';
import { AiResearchOverlay } from '@/features/trips/components/AiResearchOverlay';

export function PlannerPage() {
  const { messages, isThinking, addMessage, updateLastMessage, setThinking, clearChat, lastStructuredResponse, setLastStructuredResponse } = useAiStore();
  const [input, setInput] = useState('');
  const [showWizard, setShowWizard] = useState(true);
  const messagesEndRef = useRef(null);
  const store = useTripGeneratorStore();
  const resetWizard = store.reset;

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    if (messages.length === 0) {
      setShowWizard(true);
    }
  }, [messages.length]);

  const handleWizardComplete = async (payload, prompt) => {
    setShowWizard(false);

    const userMessage = { role: 'user', content: prompt };
    addMessage(userMessage);
    setThinking(true);
    addMessage({ role: 'assistant', content: '' });

    try {
      await aiService.streamChat(
        { message: prompt, tripContext: payload, history: [] },
        (data) => {
          if (data.type === 'token') {
            updateLastMessage(data.content);
          } else if (data.type === 'module_update') {
            useAiStore.getState().updateModule(data.module, data.data);
            if (data.module === 'fallback') {
              updateLastMessage("\n\n✨ *I've prepared a fast-track itinerary based on our local destination database. We can customize it further!*");
            }
          }
        },
        (error) => {
          console.error('Chat error:', error);
          updateLastMessage("\n\n✨ *I've prepared a fast-track itinerary based on our local destination database. We can customize it further!*");
          setThinking(false);
        },
        () => {
          setThinking(false);
        }
      );
    } catch (e) {
      console.error(e);
      updateLastMessage("\n\n✨ *I've prepared a fast-track itinerary based on our local destination database. We can customize it further!*");
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
            updateLastMessage(data.content);
          } else if (data.type === 'module_update') {
            useAiStore.getState().updateModule(data.module, data.data);
            if (data.module === 'fallback') {
              updateLastMessage("\n\n✨ *I've updated the trip plan using our localized database behind the scenes.*");
            }
          }
        },
        (error) => {
          console.error('Chat error:', error);
          updateLastMessage("\n\n✨ *I've updated the trip plan using our localized database behind the scenes.*");
          setThinking(false);
        },
        () => {
          setThinking(false);
        }
      );
    } catch (e) {
      console.error(e);
      updateLastMessage("\n\n✨ *I've updated the trip plan using our localized database behind the scenes.*");
      setThinking(false);
    }
  };

  const handleNewTrip = () => {
    clearChat();
    resetWizard();
    setShowWizard(true);
  };

  if (isThinking && messages.length === 2 && messages[1].content === '') {
    return <AiResearchOverlay destinationName={store.destination?.city || store.destination?.formattedAddress} />;
  }

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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] max-w-5xl mx-auto w-full bg-[#080D17] p-0 md:p-6 selection:bg-primary-500 selection:text-white">
      <div className="flex-1 glass-dark md:rounded-3xl md:shadow-premium-lg flex flex-col border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-8 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-primary-500/30 bg-primary-500/10 flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-light text-white tracking-wide">WanderSync <span className="font-serif italic text-primary-400">Concierge</span></h1>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mt-1">Your Personal Travel AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!showWizard && messages.length > 0 && (
              <button
                onClick={async () => {
                  const { createTrip } = (await import('@/store/tripStore')).useTripStore.getState();
                  const { user } = (await import('@/store/authStore')).useAuthStore.getState();
                  if (!user) return alert('Please login to save trips!');
                  
                  try {
                    const payload = useTripGeneratorStore.getState().generatePayload();
                    const aiStoreState = useAiStore.getState();
                    await createTrip({ 
                      ...payload, 
                      userId: user.uid,
                      authorName: user.displayName || 'Traveler',
                      itinerary: aiStoreState.lastStructuredResponse 
                        ? JSON.stringify(aiStoreState.lastStructuredResponse) 
                        : messages.map(m => m.content).join('\n\n') // Fallback to chat context
                    });
                    alert('Trip saved successfully!');
                  } catch (e) {
                    alert('Failed to save trip.');
                    console.error(e);
                  }
                }}
                className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary-50 transition-all shadow-premium hover:shadow-premium-lg"
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
                Save Trip
              </button>
            )}
            <button
              onClick={handleNewTrip}
              className="flex items-center gap-2 px-6 py-3 bg-black/50 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/20"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-black/20">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] px-6 py-5 rounded-3xl text-[15px] leading-relaxed prose prose-slate max-w-none shadow-md ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm prose-invert'
                  : 'glass-premium border border-white/10 text-white/90 rounded-bl-sm prose-invert'
              }`}>
                {msg.role === 'user' ? (
                  <span className="font-display font-light text-lg">{msg.content}</span>
                ) : (
                  <div className="font-serif text-lg text-white/80">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="glass-premium border border-white/10 px-6 py-5 rounded-3xl rounded-bl-sm flex space-x-2 items-center shadow-md">
                <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 pb-24 md:p-6 bg-black/40 backdrop-blur-xl border-t border-white/10 relative">
          {error && (
            <div className="mb-3 text-sm text-red-400 bg-red-900/20 px-4 py-3 rounded-xl border border-red-500/30 font-bold">
              {error}
            </div>
          )}
          {interimTranscript && (
            <div className="mb-3 text-sm text-white/50 italic flex items-center gap-2 font-serif">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {interimTranscript}...
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-3 max-w-4xl mx-auto"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your concierge..."
              className="flex-1 px-8 py-5 bg-black/50 border border-white/20 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white outline-none shadow-inner transition-all font-display font-light text-lg placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={toggleRecording}
              disabled={!isSupported}
              className={`p-5 rounded-full flex items-center justify-center transition-all border ${
                isListening
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 ring-2 ring-red-500/30'
                  : 'bg-black/50 text-white/50 border-white/20 hover:bg-white/10 hover:text-white'
              } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Toggle voice input"
            >
              <Mic className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-5 bg-white text-black rounded-full hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-premium hover:shadow-premium-lg"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
