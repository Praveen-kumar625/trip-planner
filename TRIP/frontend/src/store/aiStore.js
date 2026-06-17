import { create } from 'zustand';

export const useAiStore = create((set) => ({
  isOpen: false,
  messages: [],
  isThinking: false,
  
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),
  
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
  
  clearChat: () => set({ messages: [] })
}));
