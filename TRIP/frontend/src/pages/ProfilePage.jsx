import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, MapPin, Calendar, Camera, LogOut, Settings, Shield,
  Edit3, Save, X, Globe, Heart, Sparkles, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

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
      if (!user?.uid) { setLoading(false); return; }
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            displayName: data.displayName || user.displayName || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            location: data.location || '',
            bio: data.bio || '',
            travelStyles: data.travelStyles || [],
            tripsCompleted: data.tripsCompleted || 0,
            memberSince: data.createdAt?.toDate?.()?.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) || 'Recently',
          });
        } else {
          setProfile((p) => ({
            ...p,
            displayName: user.displayName || '',
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
    if (!user?.uid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        displayName: profile.displayName,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        travelStyles: profile.travelStyles,
        updatedAt: new Date(),
      }, { merge: true });
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = profile.displayName
    ? profile.displayName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 pt-16 pb-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAyYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-20" />
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-24 relative z-10">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-premium border border-neutral-100 p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={profile.displayName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                  {initials}
                </div>
              )}
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-500 hover:text-amber-500 transition-colors border border-neutral-200">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-neutral-900">{profile.displayName || 'Traveler'}</h1>
              <p className="text-neutral-500 font-medium">{profile.email}</p>
              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start text-sm text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Member since {profile.memberSince}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  {profile.tripsCompleted} trips
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors"
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
          className="bg-white rounded-3xl shadow-premium border border-neutral-100 p-6 md:p-8 mb-6"
        >
          <h2 className="text-lg font-bold text-neutral-900 mb-6">Personal Information</h2>
          <div className="space-y-5">
            <ProfileField
              icon={User}
              label="Display Name"
              value={profile.displayName}
              isEditing={isEditing}
              onChange={(v) => setProfile((p) => ({ ...p, displayName: v }))}
            />
            <ProfileField
              icon={Mail}
              label="Email"
              value={profile.email}
              isEditing={false}
              disabled
            />
            <ProfileField
              icon={MapPin}
              label="Location"
              value={profile.location}
              placeholder="Where are you based?"
              isEditing={isEditing}
              onChange={(v) => setProfile((p) => ({ ...p, location: v }))}
            />
            {isEditing && (
              <div>
                <label className="text-sm font-semibold text-neutral-500 mb-2 block">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us about yourself as a traveler..."
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none resize-none"
                />
              </div>
            )}
            {!isEditing && profile.bio && (
              <div className="px-4 py-3 bg-neutral-50 rounded-xl">
                <p className="text-sm text-neutral-600">{profile.bio}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Travel Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-premium border border-neutral-100 p-6 md:p-8 mb-6"
        >
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Travel Style</h2>
          <p className="text-sm text-neutral-500 mb-4">
            {isEditing ? 'Select your preferred travel styles.' : 'Your travel preferences help us personalize recommendations.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map((style) => {
              const isSelected = profile.travelStyles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => isEditing && toggleTravelStyle(style)}
                  disabled={!isEditing}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-50 text-amber-700 border-2 border-amber-400'
                      : isEditing
                      ? 'bg-neutral-100 text-neutral-600 border-2 border-transparent hover:bg-neutral-200'
                      : 'bg-neutral-50 text-neutral-400 border-2 border-transparent'
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
          className="bg-white rounded-3xl shadow-premium border border-neutral-100 overflow-hidden mb-6"
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
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-neutral-500" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{label}</p>
        {isEditing && !disabled ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder || label}
            className="w-full mt-1 px-3 py-2 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
          />
        ) : (
          <p className="text-sm font-medium text-neutral-700 mt-0.5">{value || '—'}</p>
        )}
      </div>
    </div>
  );
}

function QuickLink({ icon: Icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-neutral-500" />
        <span className="text-sm font-semibold text-neutral-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-neutral-300" />
    </Link>
  );
}
