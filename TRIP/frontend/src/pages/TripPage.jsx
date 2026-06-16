import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TripDetailPage } from '@/features/trip/components/TripDetailPage';
import { useTrip } from '@/features/trip/hooks/useTrip';

export function TripPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { itinerary, loading, error } = useTrip(id);
  const plan = location.state?.plan || itinerary;

  if (loading && !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] text-primary-900">
        <motion.div 
          className="glass-panel p-12 rounded-[2.5rem] flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-12 h-12 border-4 border-primary-100 border-t-accent-500 rounded-full animate-spin"></div>
          <div className="text-xl font-bold tracking-tight text-primary-900 animate-pulse">Curating your experience...</div>
        </motion.div>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-paper)] p-8 text-primary-900">
        <motion.div 
          className="glass-panel p-12 rounded-[2.5rem] max-w-lg w-full text-center border-red-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-sm">
            !
          </div>
          <div className="text-3xl font-bold mb-4 tracking-tight">Unable to load journey</div>
          <div className="text-primary-600/70 font-medium mb-10 leading-relaxed">{error}</div>
          <button 
            className="btn-luxury w-full" 
            onClick={() => navigate('/planner')}
          >
            Return to Planner
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main id="main-content" className="bg-[var(--color-paper)] min-h-screen">
      <TripDetailPage 
        plan={plan} 
        planId={id} 
      />
    </main>
  );
}
