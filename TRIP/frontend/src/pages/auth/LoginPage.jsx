import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Map, Plane, Compass, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  
  const { loginWithEmail, loginWithGoogle, loginAsGuest, resetPassword, isLoading } = useAuthStore();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setAuthError('');
    setResetMessage('');
    try {
      await loginWithEmail(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Failed to login');
    }
  };

  const handleGoogle = async () => {
    setAuthError('');
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google login failed');
      }
    }
  };

  const handleGuest = async () => {
    setAuthError('');
    try {
      await loginAsGuest();
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Guest login failed');
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email to reset password:");
    if (!email) return;
    try {
      await resetPassword(email);
      setResetMessage('Password reset email sent.');
      setAuthError('');
    } catch (err) {
      setAuthError(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Left side - Illustration & Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-amber-600 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight">
            <Compass className="w-8 h-8" />
            <span>TripPlanner</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg mt-24">
          <h1 className="text-5xl font-bold leading-tight">
            Design your perfect journey with AI.
          </h1>
          <p className="text-amber-200 text-lg">
            Create custom itineraries, manage budgets, and discover hidden gems around the globe, tailored just for you.
          </p>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/30 rounded-lg"><Sparkles className="w-5 h-5 text-amber-100" /></div>
              <span className="text-amber-50 text-lg">Smart AI Concierge</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/30 rounded-lg"><Map className="w-5 h-5 text-amber-100" /></div>
              <span className="text-amber-50 text-lg">Offline Maps & Routes</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/30 rounded-lg"><Plane className="w-5 h-5 text-amber-100" /></div>
              <span className="text-amber-50 text-lg">Real-time Flight Tracking</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-amber-200/80 text-sm mt-auto pt-24">
          © {new Date().getFullYear()} Trip Planner Inc.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Log in to sync and save your trips.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGoogle}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
            
            <button 
              onClick={handleGuest}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              <span>Continue as Guest</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-50 dark:bg-slate-950 text-slate-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input 
                {...register('email')}
                type="email" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input 
                {...register('password')}
                type="password" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-sm font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
              >
                Forgot password?
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                {authError}
              </div>
            )}

            {resetMessage && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm">
                {resetMessage}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 text-white px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors font-medium focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
