
import React from 'react';
import { CartItem, Dish } from '../types';
import { MENU_ITEMS } from '../constants';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onNavigate?: (page: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, isOpen, onClose, onUpdateQuantity, onNavigate }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const FREE_DELIVERY_THRESHOLD = 15000;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 1500;
  const vat = subtotal * 0.075;
  const total = subtotal + deliveryFee + vat;

  const progressPercent = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remainingForFree = FREE_DELIVERY_THRESHOLD - subtotal;

  const suggestions = MENU_ITEMS.filter(item => 
    (item.category === 'Sides' || item.category === 'Drinks' || item.category === 'Starters') && 
    !items.find(cartItem => cartItem.id === item.id)
  ).slice(0, 3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-green-950/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Cart Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-green-800 text-white relative overflow-hidden">
          <div className="hero-pattern absolute inset-0 opacity-10"></div>
          <div className="relative z-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter uppercase">
              <i className="fas fa-shopping-basket text-yellow-500"></i> My Order
            </h2>
            <p className="text-xs text-green-200 font-bold uppercase tracking-widest mt-1">
              {items.length} {items.length === 1 ? 'Delicacy' : 'Delicacies'} Selected
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="relative z-10 w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-all group"
          >
            <i className="fas fa-times text-xl group-hover:rotate-90 transition-transform"></i>
          </button>
        </div>

        {/* Delivery Progress */}
        {items.length > 0 && (
          <div className="bg-green-50 px-6 py-4 border-b border-green-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-green-800">
                {subtotal >= FREE_DELIVERY_THRESHOLD ? '🎉 Free Delivery Unlocked!' : 'Delivery Progress'}
              </span>
              <span className="text-[10px] font-black text-green-600">
                {subtotal >= FREE_DELIVERY_THRESHOLD ? '₦0' : `₦${remainingForFree.toLocaleString()} to go`}
              </span>
            </div>
            <div className="h-2 w-full bg-green-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50/30">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-fade-in">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <i className="fas fa-utensils text-5xl text-gray-300"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Cart is empty, Oga!</h3>
              <p className="text-gray-500 mb-8 font-light leading-relaxed">
                Your stomach is sending signals. Why not browse our legendary Jollof or Suya?
              </p>
              <button 
                onClick={() => {
                  if (onNavigate) onNavigate('menu');
                  onClose();
                }}
                className="bg-green-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-800 transition shadow-xl active:scale-95"
              >
                Go to Menu
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Item List */}
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="group bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4 relative overflow-hidden animate-item-pop"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-900 truncate pr-6">{item.name}</h3>
                      <p className="text-green-700 font-bold text-sm">₦{item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition text-gray-500 hover:text-red-500"
                          >
                            <i className={`fas ${item.quantity === 1 ? 'fa-trash-alt text-xs' : 'fa-minus text-xs'}`}></i>
                          </button>
                          <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition text-gray-500 hover:text-green-600"
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions / Upsell */}
              {suggestions.length > 0 && (
                <div className="mt-10 pt-10 border-t border-dashed border-gray-200 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Complete your meal</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {suggestions.map((dish, index) => (
                      <button 
                        key={dish.id}
                        onClick={() => onUpdateQuantity(dish.id, 1)}
                        className="shrink-0 w-40 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-left group animate-item-pop"
                        style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                      >
                        <div className="w-full h-24 rounded-xl overflow-hidden mb-3">
                          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <h5 className="text-xs font-black text-gray-900 truncate mb-1">{dish.name}</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-green-700">₦{dish.price.toLocaleString()}</span>
                          <span className="w-6 h-6 bg-yellow-400 text-green-900 rounded-lg flex items-center justify-center text-[10px] shadow-sm">
                            <i className="fas fa-plus"></i>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-2">Delivery Fee <i className="fas fa-info-circle text-[10px] opacity-30"></i></span>
                <span className={deliveryFee === 0 ? "text-green-600 font-bold" : "text-gray-900"}>
                  {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>VAT (7.5%)</span>
                <span className="text-gray-900">₦{vat.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-black text-gray-900 tracking-tight">Total Amount</span>
                <span className="text-3xl font-black text-green-800 tracking-tighter">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="group w-full bg-green-700 text-white py-5 rounded-2xl font-black text-xl hover:bg-green-800 transition shadow-xl active:scale-95 flex items-center justify-center gap-4 overflow-hidden relative"
            >
              <span className="relative z-10">Confirm Order</span>
              <i className="fas fa-arrow-right text-sm group-hover:translate-x-2 transition-transform relative z-10"></i>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>

            {/* Trust Badges */}
            <div className="mt-6 flex justify-center items-center gap-4 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <i className="fas fa-shield-alt text-lg"></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secured via Paystack</span>
              <i className="fas fa-lock text-lg"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;