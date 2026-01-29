
import React, { useState, useMemo, useEffect } from 'react';
import { Dish, CartItem } from './types';
import { MENU_ITEMS } from './constants';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import Cart from './components/Cart';
import BackToTop from './components/BackToTop';
import Reservation from './components/Reservation';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import DishDetailModal from './components/DishDetailModal';

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
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-green-900">
                        <i className="fas fa-motorcycle text-lg md:text-xl"></i>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold tracking-widest text-white/60">Estimated Delivery</div>
                        <div className="font-bold text-sm md:text-base">30 - 45 Mins</div>
                      </div>
                    </div>
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
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2 hidden xl:block">Category:</span>
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
                  <div className="relative shrink-0 w-full xl:w-auto">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 pr-10 font-bold text-[11px] text-gray-700 focus:ring-2 focus:ring-green-600 outline-none cursor-pointer w-full"
                    >
                      <option value="default">Default Sort</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]"></i>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-gray-50 pt-2">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1 hidden sm:block">Filters:</span>
                   {dietaryTags.map(tag => (
                     <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black transition-all border shrink-0 uppercase tracking-widest ${
                          activeTags.includes(tag)
                            ? 'bg-yellow-400 text-green-900 border-yellow-400 shadow-md'
                            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                        }`}
                     >
                        {tag === 'Spicy' && <i className="fas fa-pepper-hot text-red-500"></i>}
                        {tag === 'Vegan' && <i className="fas fa-leaf text-green-600"></i>}
                        {tag === 'Gluten-Free' && <i className="fas fa-wheat-awn text-orange-400"></i>}
                        {tag === 'Chef Special' && <i className="fas fa-crown text-yellow-600"></i>}
                        {tag}
                        {activeTags.includes(tag) && <i className="fas fa-times-circle ml-1 opacity-50"></i>}
                     </button>
                   ))}
                </div>
              </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 flex justify-between items-center text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
               <p>{filteredItems.length} delicacies found</p>
               {(activeCategory !== 'All' || activeTags.length > 0 || searchQuery) && (
                 <button onClick={() => {setActiveCategory('All'); setActiveTags([]); setSearchQuery('');}} className="text-green-700 font-black hover:underline">
                    Reset Filters
                 </button>
               )}
            </div>

            <section className="py-8 bg-gray-50 pb-32 md:pb-8">
              <div className="max-w-7xl mx-auto px-4">
                {filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                    {filteredItems.map(dish => (
                      <MenuCard key={dish.id} dish={dish} onAdd={addToCart} onOpenDetail={setSelectedDish} />
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                      <i className="fas fa-search text-3xl text-gray-200"></i>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight uppercase">Oga, No Result!</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed font-light">
                      We couldn't find any dishes matching your filters. Try relaxing your criteria or search for something else.
                    </p>
                    <button 
                      onClick={() => {setSearchQuery(''); setActiveCategory('All'); setActiveTags([]);}}
                      className="bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition shadow-lg active:scale-95 text-xs uppercase tracking-widest"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
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

// Sub-components to keep App.tsx manageable

const Hero: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img 
        src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=2000" 
        className="w-full h-full object-cover brightness-[0.4]"
        alt="Hero Background"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
    </div>
    <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
      <div className="mb-6 inline-flex items-center gap-2 bg-yellow-500/90 backdrop-blur px-5 py-2 rounded-full text-green-900 font-black text-[10px] uppercase tracking-[0.2em] animate-fade-in shadow-lg">
        <i className="fas fa-star text-[8px]"></i> Authentic Nigerian Flavors <i className="fas fa-star text-[8px]"></i>
      </div>
      <h1 className="text-4xl sm:text-6xl md:text-9xl text-white font-black mb-6 md:mb-8 leading-[0.95] tracking-tighter">
        THE HEART <br/>OF <span className="text-yellow-500 italic drop-shadow-2xl">NAIJA</span>
      </h1>
      <p className="text-base md:text-2xl text-gray-200 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light">
        Taste the vibrant culture and fiery soul of Nigeria in every bite. Authentic recipes, premium spices, unforgettable memories.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center max-w-sm mx-auto sm:max-w-none">
        <button onClick={() => onNavigate('menu')} className="bg-green-700 hover:bg-green-800 text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl font-black uppercase tracking-widest transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group">
          Order Now
          <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </button>
        <button onClick={() => onNavigate('reservations')} className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
          Book Table
        </button>
      </div>
    </div>
  </section>
);

const Stats: React.FC = () => (
  <section className="bg-white py-12 md:py-16 border-b relative z-10 -mt-12 md:-mt-10 mx-6 md:mx-20 rounded-[2rem] md:rounded-3xl shadow-xl">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-8 text-center divide-x divide-gray-100">
      <div className="border-none"><div className="text-3xl md:text-5xl font-black text-green-800 mb-1">20+</div><div className="text-gray-400 font-black text-[9px] md:text-xs uppercase tracking-widest">Spices Sourced</div></div>
      <div className="px-2 md:px-4 border-l border-gray-100"><div className="text-3xl md:text-5xl font-black text-green-800 mb-1">50k+</div><div className="text-gray-400 font-black text-[9px] md:text-xs uppercase tracking-widest">Happy Foodies</div></div>
      <div className="px-2 md:px-4 border-l md:border-l border-gray-100"><div className="text-3xl md:text-5xl font-black text-green-800 mb-1">100%</div><div className="text-gray-400 font-black text-[9px] md:text-xs uppercase tracking-widest">Naija Recipes</div></div>
      <div className="px-2 md:px-4 border-l border-gray-100"><div className="text-3xl md:text-5xl font-black text-green-800 mb-1">4.9</div><div className="text-gray-400 font-black text-[9px] md:text-xs uppercase tracking-widest">Avg Rating</div></div>
    </div>
  </section>
);

const FeaturedMenu: React.FC<{ onAdd: (d: Dish) => void, onSeeFull: () => void, onOpenDetail: (d: Dish) => void }> = ({ onAdd, onSeeFull, onOpenDetail }) => (
  <section className="py-20 md:py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 md:mb-16 gap-6 text-center sm:text-left">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">Chef's Selection</h2>
          <p className="text-gray-500 text-lg md:text-xl font-light italic">Hand-picked flavors for a legendary start.</p>
        </div>
        <button onClick={onSeeFull} className="text-green-700 font-black uppercase text-xs tracking-[0.2em] hover:text-green-800 transition border-b-2 border-green-700 pb-1 flex items-center gap-2">
          Full Menu <i className="fas fa-chevron-right text-[10px]"></i>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {MENU_ITEMS.slice(0, 3).map(dish => <MenuCard key={dish.id} dish={dish} onAdd={onAdd} onOpenDetail={onOpenDetail} />)}
      </div>
    </div>
  </section>
);

const StoryTeaser: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <section className="py-20 md:py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      <div className="relative">
        <img src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=1200" alt="Chef" className="rounded-[2.5rem] md:rounded-[3rem] shadow-2xl" />
        <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-green-900 text-white p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-2xl hidden sm:block max-w-[250px] md:max-w-none">
          <div className="text-2xl md:text-4xl font-black mb-3 md:mb-4 text-yellow-500 italic">"Taste is Life."</div>
          <button onClick={() => onNavigate('about')} className="text-[10px] font-black uppercase tracking-widest hover:text-yellow-500 transition flex items-center gap-2">Read Story <i className="fas fa-arrow-right"></i></button>
        </div>
      </div>
      <div>
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 md:mb-8 leading-tight tracking-tight">Tradition in <br/><span className="text-green-700 italic">Every Grain.</span></h2>
        <p className="text-lg md:text-xl text-gray-500 mb-8 md:mb-10 leading-relaxed font-light">From Grandma's kitchen in Enugu to the world, our recipes have crossed oceans but never lost their signature fire.</p>
        <button onClick={() => onNavigate('about')} className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-green-700 transition active:scale-95">Learn More</button>
      </div>
    </div>
  </section>
);

const AboutDetailed: React.FC = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 md:24">
        <div className="inline-block bg-green-100 text-green-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-8">Est. 2018</div>
        <h2 className="text-5xl md:text-8xl font-black text-gray-900 mb-6 md:mb-8 tracking-tighter">OUR STORY</h2>
        <p className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed italic">
          "The fire that cooks the Jollof must be fueled with passion."
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:32">
        <div className="space-y-6 md:space-y-8">
          <h3 className="text-3xl md:text-4xl font-black text-green-800 uppercase tracking-tight">A Humble Beginning</h3>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">Naija Bites & Grills started as a small stall in a Lagos night market. Our founder, Mama Joy, believed that everyone deserved a taste of home, no matter where they were.</p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">Today, we export that same fire, spice, and soul. We source our peppers directly from local farmers in the Nigerian heartlands to ensure authenticity in every bite.</p>
        </div>
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" className="rounded-[2.5rem] md:rounded-[3rem] shadow-2xl rotate-2" alt="Kitchen" />
      </div>
      <div className="bg-gray-950 text-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 relative overflow-hidden">
        <div className="hero-pattern absolute inset-0 opacity-10"></div>
        <div className="relative z-10 text-center">
          <h3 className="text-3xl md:text-6xl font-black mb-10 md:mb-12 tracking-tight">MEET MAMA JOY</h3>
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center text-center lg:text-left">
            <img src="https://i.pravatar.cc/300?u=mama-joy" className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 md:border-8 border-yellow-500 object-cover shadow-2xl" alt="Chef" />
            <div className="flex-1">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6 font-light italic">"I don't cook for customers, I cook for family. Every spice I add is a prayer for happiness. Nigerian food is about celebration, and I am the master of ceremonies."</p>
              <div className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">30 Years of Culinary Mastery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MenuCard: React.FC<{ dish: Dish, onAdd: (d: Dish) => void, onOpenDetail: (d: Dish) => void }> = ({ dish, onAdd, onOpenDetail }) => (
  <div className="group bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 flex flex-col h-full relative">
    <div 
      className="relative h-60 md:h-72 overflow-hidden shrink-0 cursor-pointer"
      onClick={() => onOpenDetail(dish)}
    >
      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
      <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-wrap gap-1.5 md:gap-2">
        <div className="bg-yellow-400 text-green-950 text-[8px] md:text-[10px] font-black px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg">{dish.category}</div>
        {dish.tags?.map(tag => (
          <div key={tag} className={`text-white text-[8px] md:text-[10px] font-black px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 ${
            tag === 'Spicy' ? 'bg-red-600' : tag === 'Vegan' ? 'bg-green-600' : 'bg-blue-600'
          }`}>
             {tag === 'Spicy' && <i className="fas fa-pepper-hot text-[7px]"></i>}
             {tag}
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 translate-y-2 lg:translate-y-20 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-300 z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdd(dish);
          }} 
          className="w-12 h-12 md:w-14 md:h-14 bg-green-700 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl hover:bg-green-800 transition transform active:scale-90"
        >
          <i className="fas fa-plus text-lg md:text-xl"></i>
        </button>
      </div>
    </div>
    <div className="p-6 md:p-10 flex flex-col flex-1">
      <div className="flex justify-between items-start mb-3 md:mb-4 gap-3">
        <h3 
          className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-green-800 transition-colors leading-tight cursor-pointer uppercase tracking-tight"
          onClick={() => onOpenDetail(dish)}
        >
          {dish.name}
        </h3>
        <span className="text-xl md:text-2xl font-black text-green-800 shrink-0">₦{dish.price.toLocaleString()}</span>
      </div>
      <p className="text-gray-500 mb-6 md:mb-8 line-clamp-2 text-sm md:text-base leading-relaxed font-light flex-1">{dish.description}</p>
      
      <div className="pt-4 md:pt-6 border-t border-gray-50 flex items-center justify-between">
         <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
            <i className="far fa-clock text-green-700"></i> 20-25m
         </div>
         <button 
           onClick={() => onOpenDetail(dish)}
           className="text-green-700 font-black text-[10px] uppercase tracking-widest hover:underline decoration-2 underline-offset-8 transition-all md:hidden lg:group-hover:block animate-fade-in"
         >
           Details &rarr;
         </button>
      </div>
    </div>
  </div>
);

const Footer: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <footer className="bg-[#0b1d15] text-gray-400 py-16 md:py-24 relative overflow-hidden">
    <div className="hero-pattern absolute inset-0 opacity-5"></div>
    
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-white/5 pb-16 md:pb-20">
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">
              NAIJA<span className="text-yellow-500 italic">BITES</span>
            </span>
            <span className="text-[9px] md:text-xs uppercase tracking-[0.4em] font-black text-green-500 mt-1">Authentic Nigerian Kitchen</span>
          </div>
          <p className="text-base leading-relaxed text-gray-400 font-light pr-4">
            Cross the bridge to authentic West African flavors. Every dish we serve is a celebration of our soul.
          </p>
          <div className="flex gap-4">
            {['instagram', 'facebook-f', 'twitter', 'tiktok'].map(i => (
              <a key={i} href="#" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-green-950 hover:border-yellow-500 transition-all">
                <i className={`fab fa-${i} text-sm`}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3">
            <span className="w-4 md:w-6 h-[1px] bg-yellow-500"></span> Explore
          </h4>
          <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-4 gap-x-6">
            {['Home', 'Menu', 'Reservations', 'Gallery', 'Our Story', 'Contact'].map(link => {
              const id = link.toLowerCase().replace(' ', '');
              return (
                <li key={link}>
                  <button 
                    onClick={() => onNavigate(id === 'ourstory' ? 'about' : id)} 
                    className="group flex items-center gap-2 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-yellow-500 transition-all"></span>
                    {link}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-6 md:space-y-8">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3">
            <span className="w-4 md:w-6 h-[1px] bg-yellow-500"></span> Contact
          </h4>
          <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
            <div className="pt-2 space-y-3">
              <p className="flex items-center gap-3 text-gray-400">
                <i className="fas fa-phone-alt text-yellow-500 text-xs"></i> +234 800 NAIJA BITES
              </p>
              <p className="flex items-center gap-3 text-gray-400">
                <i className="fas fa-envelope text-yellow-500 text-xs"></i> HELLO@NAIJABITES.NG
              </p>
              <p className="flex items-center gap-3 text-gray-400">
                <i className="fas fa-map-marker-alt text-yellow-500 text-xs"></i> VICTORIA ISLAND, LAGOS
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3">
            <span className="w-4 md:w-6 h-[1px] bg-yellow-500"></span> Newsletter
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">Join 5,000+ foodies for exclusive offers and recipes.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Your email" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-500 text-green-950 rounded-lg flex items-center justify-center hover:bg-yellow-400 transition-colors">
              <i className="fas fa-paper-plane text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
          &copy; {new Date().getFullYear()} NAIJA BITES & GRILLS.
        </div>
        <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest">
          <a href="#" className="hover:text-yellow-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-yellow-500 transition-colors">Terms</a>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Live Status
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default App;
