import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Heart, Bell, Globe, Moon, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/components/ui/Layout';

const menuGroups = [
  {
    title: 'Account',
    items: [
      { label: 'Travel Preferences', icon: Globe },
      { label: 'Saved Places', icon: Heart },
      { label: 'Notifications', icon: Bell },
    ]
  },
  {
    title: 'App Settings',
    items: [
      { label: 'Currency & Region', icon: Globe },
      { label: 'Theme Settings', icon: Moon },
      { label: 'General Settings', icon: Settings },
    ]
  },
  {
    title: 'Support',
    items: [
      { label: 'Help & Support', icon: HelpCircle },
    ]
  }
];

export default function HamburgerDrawer({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900">Profile</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              {/* User Profile Card */}
              <div className="flex items-center gap-4 p-4 mb-8 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                  WS
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Modern Traveler</h3>
                  <p className="text-sm text-neutral-500">View Profile</p>
                </div>
              </div>

              {/* Menu Groups */}
              <div className="space-y-8">
                {menuGroups.map((group, i) => (
                  <div key={i}>
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-4">
                      {group.title}
                    </h4>
                    <div className="space-y-1">
                      {group.items.map((item, j) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={j}
                            className="w-full flex items-center justify-between p-4 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <Icon className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-300" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
