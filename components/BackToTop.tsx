
import React, { useState, useEffect } from 'react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 600);

      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrolled / height) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div 
      className={`fixed bottom-24 md:bottom-8 left-6 md:left-8 z-40 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-50 pointer-events-none'
      }`}
    >
      <div className={`absolute inset-[-6px] rounded-2xl md:rounded-full bg-yellow-400/20 animate-ping pointer-events-none transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      
      <button
        onClick={scrollToTop}
        className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-full bg-white text-green-900 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-yellow-400 hover:scale-110 active:scale-90 transition-all group overflow-hidden border border-gray-100"
        aria-label="Back to top"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform pointer-events-none">
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="transparent"
            stroke="rgba(0,0,0,0.03)"
            strokeWidth="3"
            className="hidden md:block"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="transparent"
            stroke="#15803d" // green-700
            strokeWidth="3"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.1s linear'
            }}
            strokeLinecap="round"
            className="hidden md:block"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center">
          <i className="fas fa-chevron-up text-base md:text-lg group-hover:-translate-y-1 transition-transform duration-300"></i>
        </div>
      </button>
    </div>
  );
};

export default BackToTop;
