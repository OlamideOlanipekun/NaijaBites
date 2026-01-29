
import React, { useState, useMemo, useEffect } from 'react';
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
  const dietaryTags: ('Spicy' | 'Vegan' | 'Gluten-Free' | 'Chef Special')[] = ['Spicy', 'Vegan', 'Gluten-Free', 'Chef Special'];

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

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
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
            <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 bg-green-900 text-white overflow-hidden">
              <div className="hero-pattern absolute inset-0 opacity-10"></div>
              <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="max-w-2xl">
                    <div className="inline-block bg-yellow-500 text-green-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg">
                      Explore Flavors
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter">OUR DELICACIES</h1>
                    <p className="text-lg md:text-xl text-green-100/80 font-light leading-relaxed">
                      Discover the depth of Nigerian culinary heritage. Use the filters to find exactly what you're craving.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="sticky top-[60px] md:top-[72px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 py-4 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 space-y-4">
                <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
                  <div className="relative group w-full xl:max-w-md">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-700 transition-colors"></i>
                    <input 
                      type="text" 
                      placeholder="What are you craving today?" 
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition shadow-inner text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar w-full xl:w-auto">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all border ${
                          activeCategory === cat 
                            ? 'bg-green-700 text-white border-green-700 shadow-lg' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-700 hover:text-green-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="py-8 bg-gray-50 pb-32 md:pb-8">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                  {filteredItems.map(dish => (
                    <MenuCard key={dish.id} dish={dish} onAdd={addToCart} onOpenDetail={setSelectedDish} />
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
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen selection:bg-yellow-200 selection:text-green-900 flex flex-col">
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

// Sub-components...
const Hero: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img 
        src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=2000" 
        className="w-full h-full object-cover brightness-[0.4]"
        alt="Hero"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
    </div>
    <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl sm:text-6xl md:text-9xl text-white font-black mb-6 leading-[0.95] tracking-tighter">
        THE HEART <br/>OF <span className="text-yellow-500 italic">NAIJA</span>
      </h1>
      <button onClick={() => onNavigate('menu')} className="bg-green-700 hover:bg-green-800 text-white px-12 py-5 rounded-full text-xl font-black uppercase tracking-widest transition-all">
        Order Now
      </button>
    </div>
  </section>
);

const Stats: React.FC = () => (
  <section className="bg-white py-12 md:py-16 border-b relative z-10 -mt-12 md:-mt-10 mx-6 md:mx-20 rounded-3xl shadow-xl">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
      <div><div className="text-3xl md:text-5xl font-black text-green-800">20+</div><div className="text-gray-400 font-black text-xs uppercase">Spices</div></div>
      <div><div className="text-3xl md:text-5xl font-black text-green-800">50k+</div><div className="text-gray-400 font-black text-xs uppercase">Foodies</div></div>
      <div><div className="text-3xl md:text-5xl font-black text-green-800">100%</div><div className="text-gray-400 font-black text-xs uppercase">Naija</div></div>
      <div><div className="text-3xl md:text-5xl font-black text-green-800">4.9</div><div className="text-gray-400 font-black text-xs uppercase">Rating</div></div>
    </div>
  </section>
);

const FeaturedMenu: React.FC<{ onAdd: (d: Dish) => void, onSeeFull: () => void, onOpenDetail: (d: Dish) => void }> = ({ onAdd, onSeeFull, onOpenDetail }) => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MENU_ITEMS.slice(0, 3).map(dish => <MenuCard key={dish.id} dish={dish} onAdd={onAdd} onOpenDetail={onOpenDetail} />)}
      </div>
    </div>
  </section>
);

const StoryTeaser: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <img src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=1200" className="rounded-[3rem] shadow-2xl" alt="Chef" />
      <div>
        <h2 className="text-4xl md:text-6xl font-black mb-6">Tradition in <br/><span className="text-green-700 italic">Every Grain.</span></h2>
        <button onClick={() => onNavigate('about')} className="bg-gray-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest">Learn More</button>
      </div>
    </div>
  </section>
);

const AboutDetailed: React.FC = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <h2 className="text-5xl md:text-8xl font-black text-gray-900 mb-8">OUR STORY</h2>
      <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed italic">
        "The fire that cooks the Jollof must be fueled with passion."
      </p>
    </div>
  </section>
);

const MenuCard: React.FC<{ dish: Dish, onAdd: (d: Dish) => void, onOpenDetail: (d: Dish) => void }> = ({ dish, onAdd, onOpenDetail }) => (
  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col h-full">
    <div className="relative h-60 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(dish)}>
      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
      <button onClick={(e) => { e.stopPropagation(); onAdd(dish); }} className="absolute bottom-4 right-4 w-12 h-12 bg-green-700 text-white rounded-xl flex items-center justify-center shadow-xl">
        <i className="fas fa-plus"></i>
      </button>
    </div>
    <div className="p-6 md:p-10 flex flex-col flex-1">
      <h3 className="text-2xl font-black mb-3">{dish.name}</h3>
      <span className="text-xl font-black text-green-800 mb-4">₦{dish.price.toLocaleString()}</span>
      <p className="text-gray-500 text-sm font-light flex-1">{dish.description}</p>
    </div>
  </div>
);

const Footer: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <footer className="bg-[#0b1d15] text-gray-400 py-16 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <span className="text-3xl font-black tracking-tighter text-white uppercase">
        NAIJA<span className="text-yellow-500 italic">BITES</span>
      </span>
      <p className="mt-8 text-xs font-black tracking-widest uppercase">&copy; 2024 NAIJA BITES & GRILLS.</p>
    </div>
  </footer>
);

export default App;
