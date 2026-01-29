
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home', icon: 'fa-house' },
    { name: 'Menu', id: 'menu', icon: 'fa-utensils' },
    { name: 'Reservations', id: 'reservations', icon: 'fa-calendar-check' },
    { name: 'Gallery', id: 'gallery', icon: 'fa-images' },
    { name: 'Our Story', id: 'about', icon: 'fa-book-open' },
    { name: 'Contact', id: 'contact', icon: 'fa-phone' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLight = !isScrolled && !isMobileMenuOpen && currentPage === 'home';

  return (
    <>
      {/* Top Navigation (Desktop & Mobile Header) */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen || currentPage !== 'home' ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => handleLinkClick('home')}>
            <span className={`text-xl md:text-2xl font-bold tracking-tight transition-colors ${!isLight ? 'text-green-800' : 'text-white'}`}>
              NAIJA<span className="text-yellow-500 font-black italic">BITES</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <button 
                key={link.id} 
                onClick={() => handleLinkClick(link.id)}
                className={`font-medium transition relative pb-1 group ${
                  !isLight ? 'text-gray-700' : 'text-white'
                } ${currentPage === link.id ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-500 transition-all duration-300 ${
                  currentPage === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onCartClick}
              className={`relative p-2 rounded-full transition ${
                !isLight ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <i className="fas fa-shopping-basket text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-500 text-green-900 text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => handleLinkClick('reservations')}
              className="hidden md:block bg-yellow-500 hover:bg-yellow-600 text-green-900 px-6 py-2 rounded-full font-bold transition transform active:scale-95 shadow-lg"
            >
              Book Table
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition ${
                !isLight ? 'text-gray-800' : 'text-white'
              }`}
              aria-label="Toggle Menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Persistent) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-3xl flex justify-around items-center h-16 pointer-events-auto max-w-sm mx-auto">
          <button 
            onClick={() => handleLinkClick('home')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentPage === 'home' ? 'text-green-700' : 'text-gray-400'}`}
          >
            <i className={`fas fa-house ${currentPage === 'home' ? 'text-lg' : 'text-base opacity-70'}`}></i>
            <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => handleLinkClick('menu')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentPage === 'menu' ? 'text-green-700' : 'text-gray-400'}`}
          >
            <i className={`fas fa-utensils ${currentPage === 'menu' ? 'text-lg' : 'text-base opacity-70'}`}></i>
            <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">Menu</span>
          </button>
          <div className="relative -mt-8">
            <button 
              onClick={onCartClick}
              className="w-14 h-14 bg-green-700 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-gray-50 active:scale-90 transition-transform"
            >
              <i className="fas fa-shopping-basket text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-green-950 text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          <button 
            onClick={() => handleLinkClick('reservations')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentPage === 'reservations' ? 'text-green-700' : 'text-gray-400'}`}
          >
            <i className={`fas fa-calendar-check ${currentPage === 'reservations' ? 'text-lg' : 'text-base opacity-70'}`}></i>
            <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">Book</span>
          </button>
          <button 
            onClick={() => handleLinkClick('gallery')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentPage === 'gallery' ? 'text-green-700' : 'text-gray-400'}`}
          >
            <i className={`fas fa-images ${currentPage === 'gallery' ? 'text-lg' : 'text-base opacity-70'}`}></i>
            <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">Gallery</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-30 lg:hidden transition-all duration-500 ease-in-out transform ${
        isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        <div className="bg-white h-full w-full flex flex-col pt-24 px-8 overflow-y-auto">
          <div className="hero-pattern absolute inset-0 opacity-[0.03] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col space-y-6">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Explore Naija Bites</p>
            {navLinks.map((link, idx) => (
              <button 
                key={link.id} 
                onClick={() => handleLinkClick(link.id)}
                className={`text-5xl font-black text-left transition-all flex items-center gap-6 group ${
                  currentPage === link.id ? 'text-green-700' : 'text-gray-900'
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {link.name}
              </button>
            ))}
          </div>
          
          <div className="mt-12 pb-32 border-t border-gray-100 pt-10 relative z-10">
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-6">Let's be friends</p>
            <div className="flex gap-6 mb-12">
              {['instagram', 'facebook-f', 'twitter', 'tiktok'].map(icon => (
                <a key={icon} href="#" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-800 hover:bg-green-700 hover:text-white transition-all shadow-sm">
                  <i className={`fab fa-${icon} text-lg`}></i>
                </a>
              ))}
            </div>
            <div className="text-gray-400 text-sm font-medium space-y-1">
              <p>15 Flavors Avenue, Victoria Island</p>
              <p>Lagos, Nigeria</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
