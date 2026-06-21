import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, MapPin, Calendar, Camera, LogOut, Settings, Shield,
  Edit3, Save, X, Globe, Heart, Sparkles, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/config/supabase';

const TRAVEL_STYLES = ['Adventure', 'Luxury', 'Nature', 'Food', 'Culture', 'Nightlife', 'Road Trip', 'Relaxation'];

export function ProfilePage() {
  const { user, isGuest, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    travelStyles: [],
    tripsCompleted: 0,
    memberSince: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const { data: docSnap, error } = await supabase.from('users').select('*').eq('id', user.id).single();
        if (docSnap && !error) {
          const data = docSnap;
          setProfile({
            displayName: data.displayName || user.user_metadata?.displayName || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            location: data.location || '',
            bio: data.bio || '',
            travelStyles: data.travelStyles || [],
            tripsCompleted: data.tripsCompleted || 0,
            memberSince: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recently',
          });
        } else {
          setProfile((p) => ({
            ...p,
            displayName: user.user_metadata?.displayName || '',
            email: user.email || '',
            memberSince: 'Just now',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        displayName: profile.displayName,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        travelStyles: profile.travelStyles,
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleTravelStyle = (style) => {
    setProfile((p) => ({
      ...p,
      travelStyles: p.travelStyles.includes(style)
        ? p.travelStyles.filter((s) => s !== style)
        : [...p.travelStyles, style],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D17] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = profile.displayName
    ? profile.displayName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen bg-[#080D17] pb-24 selection:bg-primary-500 selection:text-white">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-900/40 via-[#080D17] to-[#080D17] pt-16 pb-32 border-b border-white/5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAyYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-20" />
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-24 relative z-10">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-[2.5rem] shadow-premium border border-white/10 p-6 md:p-10 mb-8 backdrop-blur-2xl"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={profile.displayName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white/10 shadow-[0_0_30px_rgba(255,184,0,0.2)]"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black text-3xl font-display font-bold border-4 border-white/10 shadow-[0_0_30px_rgba(255,184,0,0.2)]">
                  {initials}
                </div>
              )}
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#080D17] rounded-full shadow-lg flex items-center justify-center text-white/70 hover:text-primary-400 transition-colors border border-white/20 hover:border-primary-500/50">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-display font-light text-white tracking-wide">{profile.displayName || 'Traveler'}</h1>
              <p className="text-primary-400 font-serif italic mt-1">{profile.email}</p>
              <div className="flex flex-wrap items-center gap-4 mt-4 justify-center sm:justify-start text-xs font-bold uppercase tracking-widest text-white/50">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/30" />
                  Member since {profile.memberSince}
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-white/30" />
                  {profile.tripsCompleted} trips
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-black rounded-2xl font-bold text-sm hover:bg-primary-400 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(255,184,0,0.3)] tracking-wider uppercase"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-3 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 glass-premium text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors border border-white/20 tracking-wider uppercase"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-dark rounded-3xl shadow-premium border border-white/10 p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-display font-light text-white mb-8 tracking-wide">Personal Information</h2>
          <div className="space-y-6">
            <ProfileField
              icon={User}
              label="Display Name"
              value={profile.displayName}
              isEditing={isEditing}
              onChange={(v) => setProfile((p) => ({ ...p, displayName: v }))}
            />
            <div className="h-px bg-white/5" />
            <ProfileField
              icon={Mail}
              label="Email"
              value={profile.email}
              isEditing={false}
              disabled
            />
            <div className="h-px bg-white/5" />
            <ProfileField
              icon={MapPin}
              label="Location"
              value={profile.location}
              placeholder="Where are you based?"
              isEditing={isEditing}
              onChange={(v) => setProfile((p) => ({ ...p, location: v }))}
            />
            {isEditing && (
              <div className="pt-4">
                <label className="text-xs font-bold text-white/50 mb-3 block uppercase tracking-widest">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us about yourself as a traveler..."
                  rows={4}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none resize-none font-serif italic placeholder:text-white/30"
                />
              </div>
            )}
            {!isEditing && profile.bio && (
              <div className="pt-2">
                <div className="px-5 py-4 glass-premium rounded-2xl border border-white/5">
                  <p className="text-sm text-white/70 font-serif italic leading-relaxed">{profile.bio}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Travel Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-3xl shadow-premium border border-white/10 p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-display font-light text-white mb-2 tracking-wide">Travel Style</h2>
          <p className="text-sm text-white/50 mb-8 font-serif italic">
            {isEditing ? 'Select your preferred travel styles.' : 'Your travel preferences help us personalize recommendations.'}
          </p>
          <div className="flex flex-wrap gap-3">
            {TRAVEL_STYLES.map((style) => {
              const isSelected = profile.travelStyles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => isEditing && toggleTravelStyle(style)}
                  disabled={!isEditing}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30 shadow-[0_0_15px_rgba(255,184,0,0.15)]'
                      : isEditing
                      ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:border-white/20'
                      : 'bg-white/5 text-white/40 border border-transparent opacity-50'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-dark rounded-3xl shadow-premium border border-white/10 overflow-hidden mb-8"
        >
          <QuickLink icon={Settings} label="Account Settings" to="/settings" />
          <QuickLink icon={Shield} label="Privacy & Security" to="/settings" />
          <QuickLink icon={Heart} label="Saved Trips" to="/planner" />
          <QuickLink icon={Sparkles} label="AI Preferences" to="/settings" />
        </motion.div>


      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value, isEditing, onChange, placeholder, disabled }) {
  return (
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
        <Icon className="w-5 h-5 text-primary-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{label}</p>
        {isEditing && !disabled ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder || label}
            className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none font-medium placeholder:text-white/30"
          />
        ) : (
          <p className="text-base font-display text-white mt-1 tracking-wide">{value || '—'}</p>
        )}
      </div>
    </div>
  );
}

function QuickLink({ icon: Icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-8 py-5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 group"
    >
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-white/50 group-hover:text-primary-400 transition-colors" />
        <span className="text-sm font-bold uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
