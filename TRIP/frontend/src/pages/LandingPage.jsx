import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

// Aesthetic Gen-Z Destinations
const DESTINATIONS = [
  { name: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop', tag: 'Aesthetic Cafes & Beaches', budget: '₹15k - 25k' },
  { name: 'Meghalaya', img: 'https://unsplash.com/photos/people-walking-on-hanging-bridge-during-daytime-EUwzrxkJAAY', tag: 'Hidden Waterfalls', budget: '₹20k - 30k' },
  { name: 'Varanasi', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop', tag: 'Spiritual & Peaceful', budget: '₹10k - 15k' },
  { name: 'Himachal', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop', tag: 'Mountain Cabins', budget: '₹18k - 25k' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // GEN-Z AESTHETIC THEME
    // Font: Outfit (imported via style tag below)
    // Colors: Solid Beige (#F4F2EE), Deep Black (#111), Gen-Z Purple (#7C3AED), Coral (#FF4F4F)
    // No glassmorphism, solid bento grids.
    <div className="flex min-h-screen flex-col bg-[#F4F2EE] selection:bg-[#7C3AED] selection:text-white overflow-x-hidden text-[#111] relative" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Import the beautiful Outfit font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap');
        `}
      </style>

      {/* =========================================
          CLEAN NAVBAR
      ========================================= */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#F4F2EE] border-b border-black/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1200px] mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xl rounded-xl shadow-[4px_4px_0_0_#111] group-hover:-translate-y-1 group-hover:shadow-[4px_6px_0_0_#111] transition-all">
              W
            </div>
            <span className="font-bold text-2xl tracking-tight text-[#111]">Wandersync</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 bg-white border-2 border-black rounded-full px-8 py-3 shadow-[4px_4px_0_0_#111]">
            <a href="#destinations" className="font-medium text-sm hover:text-[#7C3AED] transition-colors">Vibes</a>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <a href="#planner" className="font-medium text-sm hover:text-[#FF4F4F] transition-colors">AI Planner</a>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <a href="#stories" className="font-medium text-sm hover:text-[#7C3AED] transition-colors">Stories</a>
          </div>

          <button 
            className="bg-[#111] text-white font-bold py-3 px-8 text-sm rounded-full hover:-translate-y-1 shadow-[4px_4px_0_0_#FF4F4F] transition-all border-2 border-[#111]"
            onClick={() => navigate('/planner')}
          >
            Plan a Trip
          </button>
        </div>
      </header>

      <main id="main-content" className="flex-1 flex flex-col w-full relative z-10 pt-32 md:pt-48">
        
        {/* =========================================
            HERO SECTION (BENTO GRID STYLE)
        ========================================= */}
        <section className="w-full max-w-[1200px] mx-auto px-6 pb-24 relative z-10 flex flex-col items-center text-center">
          
          <motion.div 
            className="bg-white border-2 border-black text-black font-bold text-sm px-6 py-2 rounded-full mb-8 shadow-[4px_4px_0_0_#7C3AED] inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ✨ The smartest trip planner in India
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] mb-6 text-[#111]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Plan your next trip <br/>
            without the <span className="text-[#7C3AED]">headache.</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-2xl text-[#444] max-w-2xl font-medium leading-relaxed mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Aesthetic stays, hidden cafes, and zero stress. Tell the AI what you want, and it builds your entire itinerary in seconds. 
          </motion.p>

          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button 
              className="bg-[#7C3AED] text-white font-bold text-lg px-10 py-5 rounded-full hover:-translate-y-1 border-2 border-black shadow-[6px_6px_0_0_#111] transition-all"
              onClick={() => navigate('/planner')}
            >
              Start Planning Now 🚀
            </button>
          </motion.div>

          {/* Aesthetic Hero Images Grid */}
          <motion.div 
            className="w-full mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0_0_#111] relative">
              <img src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Travel" />
              <div className="absolute top-4 left-4 bg-white border-2 border-black text-black font-bold px-3 py-1 rounded-full text-xs shadow-[2px_2px_0_0_#111]">Backpacking</div>
            </div>
            <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0_0_#FF4F4F] relative md:-translate-y-8">
              <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Heritage" />
              <div className="absolute top-4 left-4 bg-white border-2 border-black text-black font-bold px-3 py-1 rounded-full text-xs shadow-[2px_2px_0_0_#111]">Aesthetic Stays</div>
            </div>
            <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0_0_#111] relative">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Nature" />
              <div className="absolute top-4 left-4 bg-white border-2 border-black text-black font-bold px-3 py-1 rounded-full text-xs shadow-[2px_2px_0_0_#111]">Mountain Escapes</div>
            </div>
          </motion.div>
        </section>

        {/* =========================================
            DESTINATION GALLERY (BENTO GRID)
        ========================================= */}
        <section id="destinations" className="w-full py-24 bg-white border-y-2 border-black">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-5xl font-black text-[#111] mb-4">Spots that pass the vibe check.</h2>
            <p className="text-xl font-medium text-[#666] mb-12">Curated destinations for your next long weekend.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DESTINATIONS.map((dest, idx) => (
                <motion.div 
                  key={dest.name} 
                  className="group cursor-pointer bg-[#F4F2EE] border-2 border-black rounded-3xl p-3 shadow-[6px_6px_0_0_#111] hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#7C3AED] transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 border-2 border-black relative">
                    <img 
                      src={dest.img} 
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-2 pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-2xl font-bold text-[#111]">{dest.name}</h3>
                      <span className="font-bold text-[#FF4F4F]">{dest.budget}</span>
                    </div>
                    <p className="text-[#666] font-medium text-sm">{dest.tag}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            AI PLANNER (INDIAN GEN-Z CHAT MOCKUP)
        ========================================= */}
        <section id="planner" className="w-full bg-[#7C3AED] py-24 border-b-2 border-black text-white">
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="flex-1">
              <div className="bg-white text-black font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full border-2 border-black shadow-[4px_4px_0_0_#111] inline-block mb-6">
                Your AI Travel Bestie
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1]">
                Just text it what you want.
              </h2>
              <p className="text-white/90 font-medium text-xl mb-10 max-w-lg">
                Stop stressing over multiple browser tabs. Tell the AI your budget, your vibe, and who you're going with. It handles the rest.
              </p>
              
              <div className="space-y-4">
                {[
                  '"Bro, plan a 3-day trip to Goa. Need a villa with a pool and good cafes nearby."',
                  '"I want a peaceful solo trip to mountains in Himachal under 15k."',
                  '"Suggest some aesthetic heritage properties in Rajasthan for my parents."'
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-white text-black border-2 border-black rounded-2xl shadow-[4px_4px_0_0_#111] font-bold text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-md mx-auto relative">
              {/* Modern Aesthetic Chat Interface */}
              <div className="bg-[#F4F2EE] rounded-3xl p-6 border-2 border-black shadow-[12px_12px_0_0_#111] h-[550px] flex flex-col text-black">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center text-white text-xl font-black">W</div>
                    <div>
                      <div className="font-bold text-base">Wandersync AI</div>
                      <div className="text-[#00C853] text-xs font-bold flex items-center gap-1">
                        <span className="w-2 h-2 bg-[#00C853] rounded-full"></span> Online
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat History */}
                <div className="flex flex-col gap-6 mb-6 overflow-hidden">
                  <div className="self-start max-w-[85%]">
                    <div className="bg-white border-2 border-black p-4 rounded-2xl rounded-tl-sm text-sm font-medium shadow-[2px_2px_0_0_#111]">
                      "Me and my 3 friends want to go to Goa for the long weekend. We want a private villa, good seafood, and maybe a sundowner party. Total budget is ₹20k each."
                    </div>
                    <span className="text-[#666] text-[10px] font-bold mt-2 block ml-1">You • 10:24 AM</span>
                  </div>
                  
                  <div className="self-end max-w-[85%] text-right">
                    <div className="bg-[#FF4F4F] text-white border-2 border-black p-4 rounded-2xl rounded-tr-sm text-sm font-medium shadow-[2px_2px_0_0_#111] text-left">
                      "Got it! I found an insane 3BHK villa in Assagao with a private pool. Adding a sunset dinner at Thalassa and brunch at Artjuna. The total is coming around ₹18k per person. Should I lock this in?"
                    </div>
                    <span className="text-[#666] text-[10px] font-bold mt-2 block mr-1">Wandersync • 10:25 AM</span>
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="mt-auto pt-4 relative">
                  <div className="bg-white rounded-full flex items-center px-4 py-3 border-2 border-black shadow-[4px_4px_0_0_#111]">
                    <input type="text" className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-[#999]" placeholder="Message AI..." readOnly />
                    <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center cursor-pointer">
                      <span className="text-white text-sm font-bold">↑</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            TESTIMONIALS 
        ========================================= */}
        <section id="stories" className="w-full py-24 bg-[#F4F2EE]">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-5xl font-black text-center text-[#111] mb-16">What people are saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Kritika S.', role: 'Designer', text: "Literally planned my entire 5-day Kerala trip in 2 minutes while drinking coffee. The hotel recommendations were 10/10 aesthetic." },
                { name: 'Rohan M.', role: 'Software Engineer', text: "No more maintaining 5 different Excel sheets for a trip. Wandersync just gets it. Booked an amazing stay in Coorg effortlessly." },
                { name: 'Sneha R.', role: 'Student', text: "I told the AI I only had ₹10k for a weekend getaway from Delhi. It found this beautiful homestay in Himachal. Huge life saver." }
              ].map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border-2 border-black shadow-[6px_6px_0_0_#111] hover:-translate-y-2 transition-all">
                  <div className="flex gap-1 text-[#FF4F4F] text-lg mb-4">★★★★★</div>
                  <p className="text-[#111] text-base font-medium leading-relaxed mb-6">"{t.text}"</p>
                  <div>
                    <div className="font-bold text-[#111] text-lg">{t.name}</div>
                    <div className="text-[#666] font-medium text-sm">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            FINAL CTA
        ========================================= */}
        <section id="begin-journey" className="w-full bg-[#FF4F4F] py-32 flex flex-col items-center justify-center text-center border-t-2 border-black">
          <div className="max-w-3xl px-6">
            <h2 className="text-6xl md:text-8xl font-black mb-8 text-white">
              Ready to travel?
            </h2>
            <p className="text-2xl text-white/90 font-medium mb-12">
              Join thousands of Indians planning their trips without the stress.
            </p>
            <button 
              className="bg-[#111] text-white font-bold px-12 py-5 rounded-full text-xl border-2 border-[#111] shadow-[8px_8px_0_0_#F4F2EE] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#F4F2EE] transition-all"
              onClick={() => navigate('/planner')}
            >
              Start Planning Free
            </button>
          </div>
        </section>
      </main>
      
      {/* =========================================
          CLEAN FOOTER
      ========================================= */}
      <footer className="w-full bg-[#111] pt-20 pb-10 z-20 text-white">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-4 max-w-sm">
            <span className="font-black text-3xl text-white">Wandersync</span>
            <p className="font-medium text-[#999] text-base leading-relaxed">
              The smartest trip planner in India. Stop stressing, start traveling.
            </p>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-2">Explore</h4>
              <a href="#" className="font-medium text-[#999] hover:text-white transition-colors">Destinations</a>
              <a href="#" className="font-medium text-[#999] hover:text-white transition-colors">AI Planner</a>
              <a href="#" className="font-medium text-[#999] hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-2">Company</h4>
              <a href="#" className="font-medium text-[#999] hover:text-white transition-colors">About Us</a>
              <a href="#" className="font-medium text-[#999] hover:text-white transition-colors">Privacy</a>
              <a href="#" className="font-medium text-[#999] hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
          <div className="font-medium text-sm text-[#666]">
            © 2026 Wandersync. Built in India.
          </div>
        </div>
      </footer>
    </div>
  );
}
