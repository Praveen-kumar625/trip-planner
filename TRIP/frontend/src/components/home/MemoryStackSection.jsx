import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Info, Calendar, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Layout';

const MEMORIES = [
  {
    id: 'kyoto',
    title: 'The Silent Temples',
    subtitle: 'KYOTO, JAPAN',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
    mood: 'Spiritual • Serene • Ancient',
    aiInsight: 'We optimize your route to visit Fushimi Inari at 6 AM, bypassing 95% of crowd density.',
    budget: 'Premium (₹1.5L+)',
    bestSeason: 'Autumn (Nov)',
    hiddenGem: 'Otagi Nenbutsu-ji: 1200 moss-covered statues in total isolation.',
    story: 'Before the city wakes, you are walking through corridors of ancient vermillion gates. The air is crisp. There are no cameras, no crowds—only the sound of wind through the bamboo.'
  },
  {
    id: 'amalfi',
    title: 'The Golden Coast',
    subtitle: 'AMALFI, ITALY',
    image: 'https://images.unsplash.com/photo-1516483638261-f40af5ebbdc5?q=80&w=2070&auto=format&fit=crop',
    mood: 'Romantic • Sun-drenched • Decadent',
    aiInsight: 'Secures sunset dining reservations 6 months faster than standard concierges.',
    budget: 'Luxury (₹2.5L+)',
    bestSeason: 'Late September',
    hiddenGem: 'A private boat charter to a secret cove near Praiano.',
    story: 'The scent of lemon groves drifting down from the cliffs. A vintage Riva speedboat cuts through the azure Mediterranean. Tonight, your table hangs on a cliffedge over the sea.'
  },
  {
    id: 'zermatt',
    title: 'The Alpine Crown',
    subtitle: 'ZERMATT, SWITZERLAND',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2070&auto=format&fit=crop',
    mood: 'Majestic • Crisp • Thrilling',
    aiInsight: 'Predictive weather routing ensures you only ski on peak visibility days.',
    budget: 'Ultra-Luxury (₹3L+)',
    bestSeason: 'February',
    hiddenGem: 'Chez Vrony: Michelin-quality dining at 2100m altitude.',
    story: 'You wake up in a timber chalet. Through the floor-to-ceiling glass, the Matterhorn catches the first light of dawn. Fireplace cracking. The perfect run awaits.'
  }
];

const MemoryCard = ({ memory, index }) => {
  return (
    <div className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center py-20 px-4 md:px-12 sticky top-0 overflow-hidden">
      
      {/* Massive Editorial Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={memory.image} 
          alt={memory.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      </div>

      <Container className="relative z-10 w-full h-full flex flex-col justify-end pb-12 md:pb-24">
        
        {/* Magazine Cover Header */}
        <div className="flex flex-col mb-12">
          <span className="text-accent-400 font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {memory.subtitle}
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-serif font-black text-white leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">
            {memory.title}
          </h2>
        </div>

        {/* Editorial Layout Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
          
          {/* Emotional Story */}
          <div className="md:col-span-5">
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed font-serif border-l-2 border-accent-400 pl-6 py-2">
              "{memory.story}"
            </p>
          </div>

          {/* Data Points */}
          <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-4 gap-6 text-white/80">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Mood</span>
              <span className="font-medium">{memory.mood}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/50 mb-2">When to go</span>
              <span className="font-medium flex items-center gap-2"><Calendar className="w-3 h-3"/> {memory.bestSeason}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Expected Cost</span>
              <span className="font-medium text-accent-300">{memory.budget}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Secret</span>
              <span className="font-medium text-xs leading-tight">{memory.hiddenGem}</span>
            </div>
          </div>
        </div>

        {/* AI Insight Bar */}
        <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-accent-400 font-bold mb-1">WanderSync Intelligence</span>
              <p className="text-white text-sm md:text-base font-medium">{memory.aiInsight}</p>
            </div>
          </div>
          <button className="shrink-0 bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent-100 transition-colors flex items-center gap-2 group">
            Unlock {memory.id} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>

      </Container>
    </div>
  );
};

export default function MemoryStackSection() {
  return (
    <section className="relative w-full bg-black">
      {/* Hidden intro header */}
      <div className="py-24 text-center px-4">
        <span className="text-accent-400 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
          The Memory Collection
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-black text-white tracking-tight">
          Destinations that change you.
        </h2>
      </div>

      {MEMORIES.map((memory, index) => (
        <MemoryCard key={memory.id} memory={memory} index={index} />
      ))}
    </section>
  );
}
