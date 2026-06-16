import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

const Globe = lazy(() => import('../components/3d/Globe').then(m => ({ default: m.Globe })));
import { BudgetTracker } from '../features/finance/BudgetTracker';
import { Timeline } from '../features/itinerary/Timeline';
import { MagazineCard } from '../features/stories/MagazineCard';
import { MapCanvas } from '../features/itinerary/MapCanvas';
import { AIChat } from '../features/concierge/AIChat';

export function Dashboard() {
  const mockDay = {
    date: 'Day 1: Arrival & Heritage',
    theme: 'Culture',
    items: [
      { name: 'Taj Mahal at Sunrise', duration: '3 hrs', tip: 'Arrive by 5:30 AM to beat the crowds.', type: 'Sightseeing', cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80' },
      { name: 'Agra Fort', duration: '2 hrs', tip: 'Explore the red sandstone marvel.', type: 'History' }
    ]
  };

  const markers = [
    { lat: 27.1751, lng: 78.0421 },
    { lat: 27.1795, lng: 78.0211 }
  ];

  return (
    <div className="min-h-screen bg-primary-950 text-white selection:bg-accent-500 selection:text-primary-950 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-primary-500">Loading 3D Experience...</div>}>
            <Globe />
          </Suspense>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-6xl md:text-8xl font-black font-serif mb-6 leading-tight">
              Wandersync <span className="text-accent-500">AI</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-primary-200 mb-8 max-w-2xl mx-auto">
              Your intelligent luxury concierge for the definitive Indian travel experience.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn-primary">Plan a Journey</button>
              <button className="btn-outline">Explore Stories</button>
            </div>
          </motion.div>
        </div>

        {/* Gradient Fade to Content */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary-950 to-transparent z-10" />
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 relative z-20 space-y-32">
        
        {/* Curated Stories (Magazine Layout) */}
        <section>
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black font-serif text-white mb-2">Curated Journeys</h2>
            <p className="text-primary-300 font-medium">Handpicked luxury experiences across India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MagazineCard 
              title="Royal Palaces of Rajasthan" 
              tag="Rajasthan" 
              label="Heritage" 
              image="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80" 
            />
            <MagazineCard 
              title="Serene Backwaters" 
              tag="Kerala" 
              label="Wellness" 
              image="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80" 
            />
            <MagazineCard 
              title="Spiritual Awakening" 
              tag="Varanasi" 
              label="Culture" 
              image="https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=800&q=80" 
            />
          </div>
        </section>

        {/* Travel Finance Engine */}
        <section>
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black font-serif text-white mb-2">Travel Finance</h2>
            <p className="text-primary-300 font-medium">Intelligent budget tracking and forecasting</p>
          </div>
          <BudgetTracker />
        </section>

        {/* Itinerary & Map Split */}
        <section>
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black font-serif text-white mb-2">Your Itinerary</h2>
            <p className="text-primary-300 font-medium">A story-driven timeline of your next adventure</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-[800px]">
            <div className="overflow-y-auto pr-4 scrollbar-hide h-full">
              <Timeline day={mockDay} index={0} />
              <Timeline day={{...mockDay, date: 'Day 2: Forts & Flavors', items: [{ name: 'Fatehpur Sikri', duration: '4 hrs', tip: 'Stunning abandoned city' }]}} index={1} />
            </div>
            
            <div className="h-full relative rounded-3xl overflow-hidden shadow-solid border-2 border-primary-800">
              <MapCanvas markers={markers} />
            </div>
          </div>
        </section>

      </main>

      {/* Floating AI Concierge */}
      <AIChat />
    </div>
  );
}
