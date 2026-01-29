
import React from 'react';
import { Dish } from '../types';

interface DishDetailModalProps {
  dish: Dish;
  onClose: () => void;
  onAddToCart: (dish: Dish) => void;
}

const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose, onAddToCart }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-green-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-green-950 hover:bg-yellow-500 transition shadow-lg"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section */}
          <div className="lg:w-1/2 h-80 lg:h-auto relative">
            <img 
              src={dish.image} 
              alt={dish.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <div className="bg-yellow-500 text-green-950 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                {dish.category}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                {dish.name}
              </h2>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-between bg-gray-50/50">
            <div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-3xl font-black text-green-800">₦{dish.price.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star text-sm ${i < 4 ? 'text-yellow-500' : 'text-gray-200'}`}></i>
                  ))}
                  <span className="text-xs font-bold text-gray-400 ml-2">4.8 Rating</span>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Description</h4>
                  <p className="text-lg text-gray-600 font-light leading-relaxed">
                    {dish.description} Our chefs prepare this dish using traditional methods passed down through generations, ensuring an authentic taste of home.
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-8">
                  <section>
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Spice Level</h4>
                    <div className="flex gap-2 text-xl">
                      <i className={`fas fa-pepper-hot ${dish.tags?.includes('Spicy') ? 'text-red-600' : 'text-gray-200'}`}></i>
                      <i className={`fas fa-pepper-hot ${dish.tags?.includes('Spicy') ? 'text-red-600 opacity-60' : 'text-gray-200'}`}></i>
                      <i className={`fas fa-pepper-hot ${dish.tags?.includes('Spicy') ? 'text-red-600 opacity-30' : 'text-gray-200'}`}></i>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Preparation Time</h4>
                    <div className="flex items-center gap-2 text-gray-700 font-bold">
                       <i className="far fa-clock text-green-600"></i> 20 - 25 Mins
                    </div>
                  </section>
                </div>

                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-green-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-handshake"></i> Perfect Pairing
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      <img src="https://images.unsplash.com/photo-1582211594533-268f4f1edeb9?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Pairing" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Zobo House Special</p>
                      <p className="text-[10px] text-gray-400 font-medium">Adds a refreshing ginger kick</p>
                    </div>
                    <button className="ml-auto text-green-700 hover:text-green-900 transition font-black text-xs uppercase tracking-widest">Add Pair +</button>
                  </div>
                </section>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <button 
                onClick={() => onAddToCart(dish)}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-5 rounded-2xl font-black text-xl transition shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                Add to Cart <i className="fas fa-shopping-basket"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetailModal;
