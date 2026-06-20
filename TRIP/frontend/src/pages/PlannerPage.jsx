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
          } else if (data.type === 'structured') {
            setLastStructuredResponse(data.data);
            updateLastMessage("\n\n✨ *I have meticulously researched and prepared your luxury travel itinerary. You can save this trip to your profile or ask me any follow-up questions.*");
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
            updateLastMessage(data.content);
          } else if (data.type === 'structured') {
            setLastStructuredResponse(data.data);
            updateLastMessage("\n\n✨ *I have updated your travel itinerary based on your preferences. You can save this trip to your profile or ask me any follow-up questions.*");
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
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] max-w-5xl mx-auto w-full bg-slate-50 dark:bg-slate-950 p-0 md:p-6">
      <div className="flex-1 bg-white dark:bg-slate-900 md:rounded-2xl md:shadow-xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-8 border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-primary-200 dark:border-primary-900/50 bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">WanderSync Advisor</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">Your Personal Concierge</p>
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
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors border border-primary-200 dark:border-primary-800"
              >
                <Sparkles className="w-4 h-4" />
                Save Trip
              </button>
            )}
            <button
              onClick={handleNewTrip}
              className="flex items-center gap-2 px-5 py-2.5 bg-transparent text-slate-600 dark:text-slate-300 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] px-6 py-5 rounded-[2rem] text-[15px] leading-relaxed prose prose-slate max-w-none shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-br-sm dark:bg-slate-100 dark:text-slate-900 prose-invert dark:prose-slate'
                  : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm dark:prose-invert'
              }`}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-6 py-5 rounded-[2rem] rounded-bl-sm flex space-x-2 items-center shadow-sm">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative">
          {error && (
            <div className="mb-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          {interimTranscript && (
            <div className="mb-3 text-sm text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {interimTranscript}...
            </div>
          )}
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
              placeholder="Ask your concierge..."
              className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full focus:ring-2 focus:ring-primary-500/50 dark:text-white outline-none shadow-inner transition-shadow font-medium"
            />
            <button
              type="button"
              onClick={toggleRecording}
              disabled={!isSupported}
              className={`p-4 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-red-50 text-red-500 dark:bg-red-500/20 ring-2 ring-red-500/30'
                  : 'bg-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Toggle voice input"
            >
              <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
