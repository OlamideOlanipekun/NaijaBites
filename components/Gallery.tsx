
import React, { useState, useMemo } from 'react';
import { GALLERY_ITEMS } from '../constants';
import { GalleryItem } from '../types';

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Cuisine' | 'Ambiance' | 'Culture'>('All');
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  const categories: ('All' | 'Cuisine' | 'Ambiance' | 'Culture')[] = ['All', 'Cuisine', 'Ambiance', 'Culture'];

  const filteredItems = useMemo(() => {
    return activeCategory === 'All' 
      ? GALLERY_ITEMS 
      : GALLERY_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const selectedItem = selectedImageIdx !== null ? filteredItems[selectedImageIdx] : null;

  const navigateLightbox = (dir: number) => {
    if (selectedImageIdx === null) return;
    const nextIdx = (selectedImageIdx + dir + filteredItems.length) % filteredItems.length;
    setSelectedImageIdx(nextIdx);
  };

  return (
    <section id="gallery" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block bg-green-100 text-green-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">Visual Journey</div>
          <h2 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter">GALLERY OF <span className="text-green-700 italic">SOUL</span></h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Feast your eyes on the vibrant colors, rich textures, and warm moments that define the Naija Bites experience.
          </p>
          
          {/* Category Filter Bar */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
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

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-6 animate-fade-in">
          {filteredItems.map((item, idx) => {
            // Logic for a varied mosaic layout
            const isLarge = (idx % 7 === 0);
            const isTall = (idx % 5 === 1);
            const isWide = (idx % 6 === 2);

            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedImageIdx(idx)}
                className={`relative group overflow-hidden rounded-[2.5rem] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                  isLarge ? 'lg:col-span-2 lg:row-span-2' : 
                  isTall ? 'md:row-span-2' : 
                  isWide ? 'md:col-span-2' : ''
                }`}
              >
                <img 
                  src={item.url} 
                  alt={item.caption} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="bg-yellow-500 text-green-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-3 inline-block">
                      {item.category}
                    </span>
                    <h4 className="text-white text-2xl font-black tracking-tight leading-tight">
                      {item.caption}
                    </h4>
                  </div>
                </div>
                
                {/* View Icon */}
                <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-expand-alt text-lg"></i>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-32 text-center">
            <i className="fas fa-camera text-6xl text-gray-100 mb-6"></i>
            <p className="text-xl text-gray-400 font-light">No memories found in this category yet.</p>
          </div>
        )}
      </div>

      {/* Premium Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div 
            className="absolute inset-0 bg-green-950/95 backdrop-blur-2xl animate-fade-in"
            onClick={() => setSelectedImageIdx(null)}
          ></div>
          
          <button 
            onClick={() => setSelectedImageIdx(null)}
            className="absolute top-10 right-10 z-[110] w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors group"
          >
            <i className="fas fa-times text-2xl group-hover:rotate-90 transition-transform"></i>
          </button>

          <div className="relative z-[110] w-full max-w-6xl h-full flex flex-col items-center justify-center gap-8">
            <div className="relative w-full h-[60vh] md:h-[75vh] group/img">
              <img 
                src={selectedItem.url} 
                alt={selectedItem.caption} 
                className="w-full h-full object-contain drop-shadow-2xl animate-scale-in"
              />
              
              {/* Navigation Arrows */}
              <button 
                onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 hover:bg-yellow-500 text-white hover:text-green-950 rounded-2xl flex items-center justify-center transition-all opacity-0 group-hover/img:opacity-100 -translate-x-4 group-hover/img:translate-x-4 shadow-xl"
              >
                <i className="fas fa-chevron-left text-xl"></i>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 hover:bg-yellow-500 text-white hover:text-green-950 rounded-2xl flex items-center justify-center transition-all opacity-0 group-hover/img:opacity-100 translate-x-4 group-hover/img:-translate-x-4 shadow-xl"
              >
                <i className="fas fa-chevron-right text-xl"></i>
              </button>
            </div>

            <div className="text-center max-w-2xl animate-fade-in">
              <span className="text-yellow-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
                {selectedItem.category}
              </span>
              <h3 className="text-white text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-4">
                {selectedItem.caption}
              </h3>
              <div className="w-20 h-1 bg-yellow-500/30 mx-auto rounded-full"></div>
            </div>
            
            {/* Index indicator */}
            <div className="text-white/40 font-black text-xs uppercase tracking-[0.3em]">
              {selectedImageIdx + 1} / {filteredItems.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
