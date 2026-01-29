
import React, { useState, useEffect, useCallback } from 'react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  return (
    <section className="py-32 bg-green-950 text-white overflow-hidden relative border-y border-white/5">
      {/* African Pattern Background Overlay */}
      <div className="hero-pattern absolute inset-0 opacity-10 pointer-events-none"></div>
      
      {/* Decorative Gradient Blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-6">
            <div className="flex gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star text-[10px]"></i>
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">4.9/5 FROM 1,200+ FOODIES</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">VOICES OF <br/><span className="text-yellow-500 italic">NAIJA</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Don't just take our word for it. Our community of spice-lovers across the globe share their experiences.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative px-4 md:px-12">
          <div 
            className="relative min-h-[450px] md:min-h-[400px] flex items-center justify-center group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {TESTIMONIALS.map((t, idx) => (
              <div 
                key={t.id}
                className={`transition-all duration-700 absolute w-full ${
                  idx === activeIdx 
                    ? 'opacity-100 translate-x-0 scale-100 z-20' 
                    : 'opacity-0 translate-x-12 scale-95 z-10 pointer-events-none'
                }`}
              >
                <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl relative">
                  {/* Card Interior Decorative Elements */}
                  <div className="absolute -top-10 left-12 w-20 h-20 bg-yellow-500 rounded-3xl flex items-center justify-center shadow-xl rotate-6 group-hover:rotate-12 transition-transform">
                    <i className="fas fa-quote-left text-green-950 text-3xl"></i>
                  </div>
                  
                  <div className="flex flex-col items-center md:items-start md:flex-row gap-10">
                    <div className="shrink-0 relative">
                      <img src={t.avatar} className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-yellow-500/20 shadow-lg" alt={t.name} />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 border-4 border-white rounded-full flex items-center justify-center text-white text-xs">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex gap-1 mb-6 justify-center md:justify-start">
                        {[...Array(t.rating)].map((_, i) => (
                          <i key={i} className="fas fa-star text-yellow-500"></i>
                        ))}
                      </div>
                      
                      <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-gray-800 mb-8">
                        "{t.comment}"
                      </p>
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-4 border-t border-gray-100 pt-6">
                        <div>
                          <h4 className="text-xl font-black text-green-950 tracking-tight">{t.name}</h4>
                          <p className="text-green-600 font-bold text-xs uppercase tracking-widest">{t.role}</p>
                        </div>
                        <div className="hidden md:block w-px h-8 bg-gray-200"></div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                           <i className="fas fa-map-marker-alt"></i> Dining in Lagos
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Improved Navigation */}
          <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 z-30 pointer-events-none px-0 md:-px-4">
            <button 
              onClick={prev} 
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-green-950 hover:border-yellow-500 transition-all pointer-events-auto active:scale-95 shadow-xl"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <button 
              onClick={next} 
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-green-950 hover:border-yellow-500 transition-all pointer-events-auto active:scale-95 shadow-xl"
            >
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-3 mt-16">
          {TESTIMONIALS.map((_, i) => (
            <button 
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-2 transition-all duration-300 rounded-full ${
                i === activeIdx ? 'w-10 bg-yellow-500' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
