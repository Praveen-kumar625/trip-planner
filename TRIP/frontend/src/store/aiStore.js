import { create } from 'zustand';

export const useAiStore = create((set) => ({
  isOpen: false,
  messages: [],
  isThinking: false,
  lastStructuredResponse: null,
  
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),
  setLastStructuredResponse: (data) => set({ lastStructuredResponse: data }),
  updateModule: (moduleName, data) => set((state) => ({
    lastStructuredResponse: {
      ...state.lastStructuredResponse,
      modules: {
        ...(state.lastStructuredResponse?.modules || {}),
        [moduleName]: {
          status: 'COMPLETED',
          data
        }
      }
    }
  })),
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  updateLastMessage: (delta) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage.role === 'assistant') {
        lastMessage.content += delta;
      }
    }
    return { messages: newMessages };
  }),

  setThinking: (isThinking) => set({ isThinking }),
  
  clearChat: () => set({ messages: [], lastStructuredResponse: null })
}));
