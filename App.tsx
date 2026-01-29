
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Dish, CartItem } from './types.ts';
import { MENU_ITEMS } from './constants.tsx';
import Navbar from './components/Navbar.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import Cart from './components/Cart.tsx';
import BackToTop from './components/BackToTop.tsx';
import Reservation from './components/Reservation.tsx';
import Gallery from './components/Gallery.tsx';
import Testimonials from './components/Testimonials.tsx';
import Contact from './components/Contact.tsx';
import DishDetailModal from './components/DishDetailModal.tsx';

// ScrollReveal Wrapper Component
const ScrollReveal: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  animation?: 'reveal' | 'reveal-left' | 'reveal-right' | 'reveal-scale';
  delay?: number;
}> = ({ children, className = '', animation = 'reveal', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`${animation} ${isVisible ? 'active' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  const categories = ['All', 'Starters', 'Main', 'Soups', 'Grills', 'Drinks'];

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = activeTags.length === 0 || 
                          activeTags.every(tag => item.tags?.includes(tag as any));
      
      return matchesCategory && matchesSearch && matchesTags;
    });

    if (sortBy === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [activeCategory, searchQuery, sortBy, activeTags]);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setSelectedDish(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'menu':
        return (
          <div className="animate-fade-in bg-white min-h-screen">
            <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 bg-green-950 text-white overflow-hidden">
              <div className="hero-pattern absolute inset-0 opacity-10"></div>
              <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                <ScrollReveal animation="reveal-scale">
                  <div className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-xl">
                    The Full Spread
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter drop-shadow-2xl">THE MENU</h1>
                  <p className="text-lg md:text-2xl text-green-100/80 font-light max-w-3xl mx-auto leading-relaxed">
                    Carefully curated selection of Nigeria's most beloved dishes, prepared with authentic ingredients and a modern touch.
                  </p>
                </ScrollReveal>
              </div>
            </section>

            <section className="sticky top-[60px] md:top-[72px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 py-6 shadow-sm">
              <div className="max-w-7xl mx-auto px-4">
                <ScrollReveal animation="reveal" delay={200}>
                  <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full xl:max-w-md">
                      <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input 
                        type="text" 
                        placeholder="Search for Jollof, Suya, Egusi..." 
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-green-600/10 focus:border-green-600 outline-none transition shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 xl:pb-0 no-scrollbar w-full xl:w-auto">
                      {categories.map((cat, idx) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                            activeCategory === cat 
                              ? 'bg-green-800 text-white border-green-800 shadow-xl scale-105' 
                              : 'bg-white text-gray-400 border-gray-100 hover:border-green-800 hover:text-green-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <section className="py-16 bg-gray-50/50 pb-40 md:pb-16">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredItems.map((dish, idx) => (
                    <ScrollReveal key={dish.id} animation="reveal" delay={idx * 100}>
                      <MenuCard dish={dish} onAdd={addToCart} onOpenDetail={setSelectedDish} />
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );
      case 'reservations':
        return <div className="pt-20 pb-32 md:pb-0 animate-fade-in"><Reservation /></div>;
      case 'gallery':
        return <div className="pt-20 pb-32 md:pb-0 animate-fade-in"><Gallery /></div>;
      case 'about':
        return (
          <div className="animate-fade-in pt-20 pb-32 md:pb-0">
            <AboutDetailed />
            <Testimonials />
          </div>
        );
      case 'contact':
        return <div className="pt-20 pb-32 md:pb-0 animate-fade-in"><Contact /></div>;
      default:
        return (
          <div className="animate-fade-in pb-32 md:pb-0">
            <Hero onNavigate={navigateTo} />
            <Stats />
            <FeaturedMenu onAdd={addToCart} onSeeFull={() => navigateTo('menu')} onOpenDetail={setSelectedDish} />
            <StoryTeaser onNavigate={navigateTo} />
            <Testimonials />
            <Newsletter />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen selection:bg-yellow-200 selection:text-green-950 flex flex-col font-sans">
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer onNavigate={navigateTo} />
      <Cart 
        isOpen={isCartOpen} 
        items={cart} 
        onClose={() => setIsCartOpen(false)} 
        onUpdateQuantity={updateCartQuantity}
      />
      {selectedDish && (
        <DishDetailModal 
          dish={selectedDish} 
          onClose={() => setSelectedDish(null)} 
          onAddToCart={(dish) => {
            addToCart(dish);
            setSelectedDish(null);
          }}
        />
      )}
      <AIAssistant />
      <BackToTop />
    </div>
  );
};

const Hero: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
    <div className="absolute inset-0 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=2000" 
        className="w-full h-full object-cover brightness-[0.4] scale-110 animate-slow-scale"
        alt="Hero Background"
      />
      <div className="hero-pattern absolute inset-0 opacity-[0.2]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
    </div>

    <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
      <div className="animate-fade-in-up">
        <ScrollReveal animation="reveal-scale" delay={100}>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-2 rounded-full mb-10 shadow-2xl">
            <span className="flex gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-[10px]"></i>)}
            </span>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Lagos' Finest Culinary Experience</span>
          </div>
        </ScrollReveal>
        
        <ScrollReveal animation="reveal" delay={300}>
          <h1 className="text-6xl sm:text-8xl md:text-[10rem] text-white font-black mb-10 leading-[0.85] tracking-tighter drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
            BEYOND <br/>
            <span className="text-yellow-500 italic relative">
              FLAVOR
              <svg className="absolute -bottom-4 left-0 w-full h-6 text-yellow-600/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
          </h1>
        </ScrollReveal>
        
        <ScrollReveal animation="reveal" delay={500}>
          <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-14 font-light leading-relaxed animate-fade-in-delayed">
            Experience the vibrant soul of <span className="text-white font-black">Nigeria</span> through smokey grills, 
            authentic soups, and hospitality that feels like home.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="reveal-scale" delay={700}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in-delayed">
            <button 
              onClick={() => onNavigate('menu')} 
              className="group relative bg-green-700 hover:bg-green-600 text-white px-12 py-6 rounded-3xl text-xl font-black uppercase tracking-widest transition-all shadow-[0_25px_50px_-12px_rgba(21,128,61,0.5)] hover:-translate-y-1 active:scale-95 flex items-center gap-4 overflow-hidden"
            >
              <span className="relative z-10">Start Your Feast</span>
              <i className="fas fa-arrow-right text-sm relative z-10 group-hover:translate-x-2 transition-transform"></i>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <button 
              onClick={() => onNavigate('reservations')} 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/30 px-12 py-6 rounded-3xl text-xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl"
            >
              Book a Table
            </button>
          </div>
        </ScrollReveal>
      </div>
    </div>

    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/50 animate-bounce">
      <span className="text-[10px] font-black uppercase tracking-[0.5em]">Discover More</span>
      <div className="w-[1px] h-12 bg-gradient-to-b from-yellow-500 to-transparent"></div>
    </div>
  </section>
);

const Stats: React.FC = () => (
  <section className="bg-white py-16 md:py-24 border-b relative z-10 -mt-20 mx-6 md:mx-24 rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden">
    <div className="hero-pattern absolute inset-0 opacity-[0.03] pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
      <ScrollReveal animation="reveal" delay={100} className="text-center group">
        <div className="text-4xl md:text-6xl font-black text-green-900 mb-2 group-hover:scale-110 transition-transform">25+</div>
        <div className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Secret Spices</div>
      </ScrollReveal>
      <ScrollReveal animation="reveal" delay={200} className="text-center group">
        <div className="text-4xl md:text-6xl font-black text-green-900 mb-2 group-hover:scale-110 transition-transform">12k+</div>
        <div className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Happy Foodies</div>
      </ScrollReveal>
      <ScrollReveal animation="reveal" delay={300} className="text-center group">
        <div className="text-4xl md:text-6xl font-black text-green-900 mb-2 group-hover:scale-110 transition-transform">100%</div>
        <div className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Authentic Naija</div>
      </ScrollReveal>
      <ScrollReveal animation="reveal" delay={400} className="text-center group">
        <div className="text-4xl md:text-6xl font-black text-green-900 mb-2 group-hover:scale-110 transition-transform">4.9</div>
        <div className="text-gray-400 font-black text-[10px] uppercase tracking-widest">User Rating</div>
      </ScrollReveal>
    </div>
  </section>
);

const FeaturedMenu: React.FC<{ onAdd: (d: Dish) => void, onSeeFull: () => void, onOpenDetail: (d: Dish) => void }> = ({ onAdd, onSeeFull, onOpenDetail }) => (
  <section className="py-32 bg-gray-50/30">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <ScrollReveal animation="reveal-left">
          <div className="max-w-2xl">
            <span className="text-green-700 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Chef's Picks</span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">OUR <br/><span className="text-green-800 italic">SIGNATURES</span></h2>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="reveal-right">
          <button 
            onClick={onSeeFull}
            className="bg-green-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-600 hover:text-green-950 transition-all shadow-xl"
          >
            View Full Menu
          </button>
        </ScrollReveal>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {MENU_ITEMS.slice(0, 3).map((dish, idx) => (
          <ScrollReveal key={dish.id} animation="reveal" delay={idx * 150}>
            <MenuCard dish={dish} onAdd={onAdd} onOpenDetail={onOpenDetail} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

const MenuCard: React.FC<{ dish: Dish, onAdd: (d: Dish) => void, onOpenDetail: (d: Dish) => void }> = ({ dish, onAdd, onOpenDetail }) => (
  <div className="group bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-3xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative">
    <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(dish)}>
      <img 
        src={dish.image} 
        alt={dish.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
      
      {dish.tags?.includes('Chef Special') && (
        <div className="absolute top-6 left-6 bg-yellow-500 text-green-950 font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
          Chef Signature
        </div>
      )}

      <button 
        onClick={(e) => { e.stopPropagation(); onAdd(dish); }} 
        className="absolute bottom-6 right-6 w-14 h-14 bg-green-700 text-white rounded-2xl flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-green-800"
      >
        <i className="fas fa-plus text-xl"></i>
      </button>
    </div>
    
    <div className="p-10 flex flex-col flex-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-black text-gray-900 group-hover:text-green-800 transition-colors">{dish.name}</h3>
        <span className="text-xl font-black text-green-700">₦{dish.price.toLocaleString()}</span>
      </div>
      <p className="text-gray-500 text-sm font-light leading-relaxed mb-8 flex-1">{dish.description}</p>
      
      <div className="flex gap-2">
        {dish.tags?.map(tag => (
          <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const StoryTeaser: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <section className="py-32 bg-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <ScrollReveal animation="reveal-left">
        <div className="relative group">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-colors"></div>
          <img 
            src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=1200" 
            className="rounded-[4rem] shadow-3xl relative z-10 transition-transform duration-700 group-hover:-rotate-2 group-hover:scale-[1.02]" 
            alt="Our Heritage" 
          />
          <div className="absolute -bottom-10 -right-10 bg-green-900 text-white p-10 rounded-[3rem] shadow-2xl z-20 max-w-[280px]">
            <p className="text-sm font-light italic leading-relaxed">
              "We don't just cook Jollof; we tell the story of a thousand Lagos evenings."
            </p>
            <div className="mt-4 font-black text-[10px] uppercase tracking-widest text-yellow-500">— Chef Ebuka</div>
          </div>
        </div>
      </ScrollReveal>
      
      <div className="pt-10 lg:pt-0">
        <ScrollReveal animation="reveal-right" delay={200}>
          <span className="text-green-700 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Our Legacy</span>
          <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9]">CULTURE <br/><span className="text-green-900 italic">ON A PLATE.</span></h2>
          <p className="text-xl text-gray-500 font-light leading-relaxed mb-12">
            Naija Bites was born from a simple dream: to bring the authentic, unfiltered flavors of West Africa to the global stage. From our wood-fired grills to the hand-pounded yam, every bite is a celebration of heritage.
          </p>
          <button 
            onClick={() => onNavigate('about')} 
            className="group flex items-center gap-6 bg-gray-900 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-green-800 transition-all shadow-xl active:scale-95"
          >
            Discover Our Story
            <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
          </button>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

const AboutDetailed: React.FC = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <ScrollReveal animation="reveal-scale" className="mb-20">
        <h2 className="text-6xl md:text-[10rem] font-black text-gray-900 tracking-tighter leading-none mb-10">THE SOUL <br/>OF NAIJA</h2>
        <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mb-10"></div>
        <p className="text-2xl text-gray-500 max-w-4xl mx-auto font-light leading-relaxed italic">
          "The fire that cooks the Jollof must be fueled with passion, the spices must be chosen with love, and the table must always be long enough for everyone."
        </p>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <ScrollReveal animation="reveal" delay={100} className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100 group hover:bg-green-900 transition-all duration-500">
           <i className="fas fa-leaf text-4xl text-green-700 mb-6 group-hover:text-yellow-500"></i>
           <h3 className="text-2xl font-black mb-4 group-hover:text-white">Farm to Pot</h3>
           <p className="text-gray-500 text-sm leading-relaxed group-hover:text-green-100">We source our peppers and vegetables directly from local Lagos markets daily.</p>
        </ScrollReveal>
        <ScrollReveal animation="reveal" delay={200} className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100 group hover:bg-green-900 transition-all duration-500">
           <i className="fas fa-fire-burner text-4xl text-green-700 mb-6 group-hover:text-yellow-500"></i>
           <h3 className="text-2xl font-black mb-4 group-hover:text-white">Slow Cooking</h3>
           <p className="text-gray-500 text-sm leading-relaxed group-hover:text-green-100">No shortcuts. Our soups simmer for hours to achieve deep, authentic flavor profiles.</p>
        </ScrollReveal>
        <ScrollReveal animation="reveal" delay={300} className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100 group hover:bg-green-900 transition-all duration-500">
           <i className="fas fa-users text-4xl text-green-700 mb-6 group-hover:text-yellow-500"></i>
           <h3 className="text-2xl font-black mb-4 group-hover:text-white">Family Vibe</h3>
           <p className="text-gray-500 text-sm leading-relaxed group-hover:text-green-100">At Naija Bites, we don't have customers. We have guests who become family.</p>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

const Newsletter: React.FC = () => (
  <section className="py-24 bg-green-950 text-white relative overflow-hidden mx-6 md:mx-16 rounded-[4rem] mb-24 shadow-[0_50px_100px_-20px_rgba(6,45,29,0.5)]">
    <div className="hero-pattern absolute inset-0 opacity-[0.15]"></div>
    <div className="absolute -top-20 -left-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px] animate-pulse"></div>
    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

    <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
      <ScrollReveal animation="reveal-scale">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8 backdrop-blur-md">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">Exclusive Invites Only</span>
        </div>
        
        <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
          READY TO <span className="text-yellow-500 italic">FEAST?</span>
        </h2>
        <p className="text-green-100/70 mb-14 text-xl font-light leading-relaxed max-w-3xl mx-auto">
          Join the <span className="text-white font-black">Pepper Gang</span> for secret menu drops, VIP table priority, and a first look at our Lagos pop-ups.
        </p>
      </ScrollReveal>
      
      <ScrollReveal animation="reveal" delay={300}>
        <form className="flex flex-col sm:flex-row gap-5 max-w-3xl mx-auto p-2 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-inner" onSubmit={(e) => e.preventDefault()}>
          <div className="flex-1 relative group">
            <i className="fas fa-envelope absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-yellow-500 transition-colors"></i>
            <input 
              type="email" 
              placeholder="Enter your email o!" 
              className="w-full bg-transparent border-none px-14 py-6 rounded-3xl outline-none text-lg font-medium text-white placeholder:text-white/20"
            />
          </div>
          <button className="bg-yellow-500 hover:bg-white text-green-950 px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
            Join the Gang <i className="fas fa-bolt text-xs"></i>
          </button>
        </form>
      </ScrollReveal>
      
      <ScrollReveal animation="reveal" delay={500} className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
         <span className="flex items-center gap-2"><i className="fas fa-shield-alt text-yellow-500/50"></i> 100% Secure</span>
         <span className="flex items-center gap-2"><i className="fas fa-star text-yellow-500/50"></i> VIP Treatment</span>
         <span className="flex items-center gap-2"><i className="fas fa-bell-slash text-yellow-500/50"></i> No Spam Policy</span>
      </ScrollReveal>
    </div>
  </section>
);

const Footer: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <footer className="bg-gray-950 text-gray-500 pt-32 pb-16 relative overflow-hidden border-t border-white/5">
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
    
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
      <ScrollReveal animation="reveal-left" className="lg:col-span-5 flex flex-col md:flex-row gap-12">
        <div className="flex flex-col items-center md:items-start">
           <div className="text-white font-black text-7xl leading-none tracking-tighter mb-6 select-none opacity-20">
              NAI<br/>JA.
           </div>
           <span className="text-3xl font-black tracking-tighter text-white uppercase block mb-8">
            NAIJA<span className="text-yellow-500 italic">BITES</span>
          </span>
          <p className="text-sm leading-loose max-w-sm mb-12 text-gray-400 font-light italic">
            "We don't just serve food; we serve memories. Every spice blend, every smoky flame, every grain of rice is a love letter to the vibrant streets of Lagos."
          </p>
          <div className="flex gap-5">
            {['instagram', 'twitter', 'facebook-f', 'tiktok'].map(icon => (
              <a key={icon} href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-yellow-500 hover:bg-white/10 hover:-translate-y-1 transition-all border border-white/5 shadow-lg group">
                <i className={`fab fa-${icon} text-xl group-hover:scale-110 transition-transform`}></i>
              </a>
            ))}
          </div>
        </div>
      </ScrollReveal>
      
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12">
        <ScrollReveal animation="reveal" delay={100}>
          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.5em] mb-12 flex items-center gap-3">
             <span className="w-4 h-px bg-yellow-500/50"></span> Explore
          </h4>
          <ul className="space-y-6">
            {['Menu', 'Reservations', 'Gallery', 'Our Story', 'Contact'].map(item => (
              <li key={item}>
                <button 
                  onClick={() => onNavigate(item.toLowerCase().replace(' ', ''))} 
                  className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 scale-0 group-hover:scale-100 transition-transform"></span>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal animation="reveal" delay={200}>
          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.5em] mb-12 flex items-center gap-3">
             <span className="w-4 h-px bg-yellow-500/50"></span> Experience
          </h4>
          <ul className="space-y-6">
            {[
              { label: 'Private Dining', desc: 'Curated experiences' },
              { label: 'Event Catering', desc: 'Naija flavor on tour' },
              { label: 'Chef Table', desc: 'Behind the scenes' },
              { label: 'Suya Pop-ups', desc: 'Street food elevated' }
            ].map(item => (
              <li key={item.label}>
                <a href="#" className="block group">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-yellow-500 transition-colors">{item.label}</span>
                  <span className="block text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">{item.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal animation="reveal" delay={300}>
          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.5em] mb-12 flex items-center gap-3">
             <span className="w-4 h-px bg-yellow-500/50"></span> Location
          </h4>
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 space-y-8">
            <div>
              <p className="text-white mb-2">Lagos Flagship</p>
              <p className="leading-relaxed">15 Flavors Avenue, VI<br/>Lagos, Nigeria</p>
            </div>
            <div>
              <p className="text-white mb-2">Connect o!</p>
              <p className="leading-relaxed text-yellow-500/80 hover:text-yellow-500 cursor-pointer transition-colors">+234 800 NAIJA BITES</p>
              <p className="leading-relaxed hover:text-white cursor-pointer transition-colors mt-2">hello@naijabites.ng</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
    
    <ScrollReveal animation="reveal" delay={500} className="max-w-7xl mx-auto px-6 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="flex flex-col items-center md:items-start gap-3">
        <p className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-600">
          &copy; 2024 NAIJA BITES & GRILLS GROUP.
        </p>
        <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-gray-700">
          Hand-crafted with Soul in <span className="text-green-800">Lagos</span>
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-10 text-[9px] font-black uppercase tracking-[0.3em]">
        <a href="#" className="text-gray-600 hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="text-gray-600 hover:text-white transition-colors">Terms of Service</a>
        <a href="#" className="text-gray-600 hover:text-white transition-colors">Cookie Settings</a>
      </div>

      <div className="flex items-center gap-4 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
         <div className="flex flex-col items-end">
            <span className="text-[7px] font-black uppercase text-white leading-none">Powered by</span>
            <span className="text-[10px] font-black uppercase text-white leading-none tracking-widest mt-0.5 italic">Paystack</span>
         </div>
         <i className="fas fa-shield-halved text-2xl text-white"></i>
      </div>
    </ScrollReveal>
  </footer>
);

export default App;
