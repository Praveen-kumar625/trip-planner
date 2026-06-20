import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Layout';

const TIMELINE_STEPS = [
  {
    number: "01",
    title: "Dream",
    description: "Tell us what you desire in a single sentence. A romantic escape to the Amalfi coast? A culinary journey through Tokyo? We translate your imagination into reality.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
  },
  {
    number: "02",
    title: "Discover",
    description: "Our AI curates an exclusive, tailored itinerary in seconds. We don't just find hotels; we discover hidden gems, private tours, and the best tables in town.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    number: "03",
    title: "Experience",
    description: "Travel with confidence. Access your interactive itinerary, real-time weather, offline maps, and smart budget tracking all in one beautifully designed app.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function EditorialTimeline() {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-black relative">
      <Container>
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 block">The Journey</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            How the <span className="italic font-light text-accent-600 dark:text-accent-400">magic</span> happens
          </h2>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {TIMELINE_STEPS.map((step, idx) => {
            const isEven = idx % 2 === 1;
            
            return (
              <div 
                key={step.number}
                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-premium-lg"
                  >
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                  </motion.div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="text-6xl md:text-8xl font-serif font-bold text-slate-100 dark:text-slate-800/50 mb-6 block leading-none select-none">
                      {step.number}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6 relative -mt-12 md:-mt-16 ml-4 md:ml-8">
                      {step.title}
                    </h3>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium ml-4 md:ml-8">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
