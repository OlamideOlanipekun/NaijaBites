
import React, { useState } from 'react';

const Reservation: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    occasion: 'None',
    tablePreference: 'Main Dining'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, this would send to an API
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  const tableTypes = [
    { id: 'Main Dining', icon: 'fa-chair', label: 'Main Hall', desc: 'Heart of the vibe' },
    { id: 'Terrace', icon: 'fa-sun', label: 'The Terrace', desc: 'Fresh air & Lagos views' },
    { id: 'VIP Lounge', icon: 'fa-crown', label: 'VIP Lounge', desc: 'Private & Sophisticated' }
  ];

  const occasions = ['None', 'Birthday', 'Anniversary', 'Date Night', 'Business Meeting'];

  // Prevent selecting past dates
  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="reservations" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50/50 -skew-x-12 transform origin-top-right pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Context & Info */}
          <div className="lg:col-span-5 pt-10">
            <div className="inline-block bg-yellow-500 text-green-950 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-md">
              Hospitality First
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tighter">
              SECURE YOUR <br/><span className="text-green-700 italic">SPOT</span>
            </h2>
            <p className="text-xl text-gray-500 mb-12 max-w-lg font-light leading-relaxed">
              Whether it's a quiet evening for two or a boisterous celebration with the whole squad, we ensure your table is as warm as our hospitality.
            </p>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-yellow-600 shrink-0 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                  <i className="fas fa-calendar-check text-xl"></i>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">Instant Confirmation</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Book through our portal and receive your SMS/Email confirmation immediately.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-green-700 shrink-0 group-hover:bg-green-700 group-hover:text-white transition-all">
                  <i className="fas fa-utensils text-xl"></i>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">Special Occasions</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Celebrating? Mention it in your booking for a special Naija Bites surprise.</p>
                </div>
              </div>

              <div className="mt-8 p-8 bg-green-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="hero-pattern absolute inset-0 opacity-10"></div>
                <div className="relative z-10">
                  <h4 className="text-yellow-500 font-black uppercase tracking-widest text-xs mb-4">Direct Support</h4>
                  <p className="text-2xl font-bold mb-2">+234 800 NAIJA BITES</p>
                  <p className="text-green-200 text-sm opacity-80">For groups larger than 12, please call us directly for specialized logistics.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 relative">
              
              {submitted ? (
                <div className="text-center py-20 animate-fade-in">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">
                    <i className="fas fa-check"></i>
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Table Reserved!</h3>
                  <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 max-w-sm mx-auto">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Booking Summary</p>
                    <p className="text-lg text-gray-700 font-medium">
                      {formData.guests} Guests • {formData.tablePreference}<br/>
                      {new Date(formData.date).toLocaleDateString()} at {formData.time}
                    </p>
                  </div>
                  <p className="text-gray-500 mb-10">Oga {formData.name}, we've sent the details to {formData.email}. See you soon!</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-green-700 font-black uppercase tracking-widest hover:underline"
                  >
                    Make another booking
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  
                  {/* Step 1: Basics */}
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="w-8 h-8 rounded-full bg-green-900 text-white flex items-center justify-center font-bold text-xs">1</span>
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">The Essentials</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="e.g. Ebuka Jones"
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition font-medium"
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                        <input 
                          required 
                          type="tel" 
                          placeholder="+234..."
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition font-medium"
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Party Size</label>
                        <select 
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition font-bold cursor-pointer appearance-none"
                          value={formData.guests}
                          onChange={(e) => setFormData({...formData, guests: e.target.value})}
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Preferred Date</label>
                        <input 
                          required 
                          type="date" 
                          min={today}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition font-medium"
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Arrival Time</label>
                        <input 
                          required 
                          type="time" 
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition font-medium"
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Step 2: Customization */}
                  <section>
                    <div className="flex items-center gap-4 mb-8 pt-4 border-t border-gray-50">
                      <span className="w-8 h-8 rounded-full bg-green-900 text-white flex items-center justify-center font-bold text-xs">2</span>
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Your Preference</h3>
                    </div>
                    
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Table Atmosphere</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {tableTypes.map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({...formData, tablePreference: type.id})}
                          className={`flex flex-col items-center p-5 rounded-2xl border-2 transition-all ${
                            formData.tablePreference === type.id 
                              ? 'bg-green-50 border-green-600 text-green-900 shadow-md scale-105' 
                              : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'
                          }`}
                        >
                          <i className={`fas ${type.icon} text-2xl mb-3 ${formData.tablePreference === type.id ? 'text-green-700' : ''}`}></i>
                          <span className="font-bold text-sm mb-1">{type.label}</span>
                          <span className="text-[10px] text-center opacity-70 leading-tight">{type.desc}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">What are we celebrating?</label>
                        <select 
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition font-medium cursor-pointer"
                          onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                        >
                          {occasions.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                        </select>
                      </div>
                    </div>
                  </section>

                  <div className="pt-6">
                    <button className="w-full bg-green-700 text-white py-6 rounded-2xl font-black text-xl hover:bg-green-800 transition transform active:scale-95 shadow-2xl flex items-center justify-center gap-4">
                      Confirm Reservation <i className="fas fa-chevron-right text-sm"></i>
                    </button>
                    
                    <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                       <span className="flex items-center gap-2"><i className="fas fa-check-circle text-green-500"></i> Free Cancellation</span>
                       <span className="flex items-center gap-2"><i className="fas fa-check-circle text-green-500"></i> Smart Booking</span>
                       <span className="flex items-center gap-2"><i className="fas fa-check-circle text-green-500"></i> 15m Grace Period</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
