
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  const contactMethods = [
    {
      id: 'visit',
      title: 'Our Home',
      info: '15 Flavors Avenue, Victoria Island, Lagos',
      icon: 'fa-map-location-dot',
      color: 'bg-green-100 text-green-700',
      action: 'Get Directions',
      link: 'https://maps.google.com'
    },
    {
      id: 'call',
      title: 'Direct Line',
      info: '+234 800 NAIJA BITES',
      icon: 'fa-phone-volume',
      color: 'bg-yellow-100 text-yellow-700',
      action: 'Call Now',
      link: 'tel:+23480062452'
    },
    {
      id: 'email',
      title: 'Digital Desk',
      info: 'hello@naijabites.ng',
      icon: 'fa-envelope-open-text',
      color: 'bg-blue-100 text-blue-700',
      action: 'Email Us',
      link: 'mailto:hello@naijabites.ng'
    }
  ];

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-green-900 -skew-y-3 origin-top-left -translate-y-20">
        <div className="hero-pattern absolute inset-0 opacity-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20 pt-10">
          <div className="inline-block bg-yellow-500 text-green-950 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-xl">
            Connect With Us
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-md">
            LET'S <span className="text-yellow-500 italic">TALK</span> SHOP
          </h2>
          <p className="text-xl text-yellow-100/90 max-w-2xl mx-auto font-light leading-relaxed">
            Have a question about our menu, interested in catering, or just want to say hi? We're all ears and ready to spice up your day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Side: Contact Cards */}
          <div className="lg:col-span-4 space-y-6">
            {contactMethods.map((method) => (
              <a 
                key={method.id}
                href={method.link}
                target={method.id === 'visit' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group block bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 duration-500 ${method.color}`}>
                    <i className={`fas ${method.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{method.title}</h4>
                    <p className="text-lg font-bold text-gray-900 mb-2 leading-tight">{method.info}</p>
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest flex items-center gap-2">
                      {method.action} <i className="fas fa-arrow-right text-[8px] group-hover:translate-x-1 transition-transform"></i>
                    </span>
                  </div>
                </div>
              </a>
            ))}

            <div className="bg-gray-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="hero-pattern absolute inset-0 opacity-5"></div>
               <div className="relative z-10">
                 <h4 className="text-yellow-500 font-black uppercase tracking-widest text-xs mb-6">Social Vibes</h4>
                 <div className="grid grid-cols-4 gap-4">
                    {['instagram', 'facebook-f', 'twitter', 'tiktok'].map(icon => (
                      <a 
                        key={icon} 
                        href="#" 
                        className="w-full aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-yellow-500 hover:text-green-950 transition-all duration-300"
                      >
                        <i className={`fab fa-${icon} text-lg`}></i>
                      </a>
                    ))}
                 </div>
                 <p className="mt-8 text-xs text-gray-500 font-medium leading-relaxed">
                   Tag us in your food photos using <span className="text-white">#NaijaBites</span> for a chance to be featured in our monthly digest!
                 </p>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 flex-1 relative overflow-hidden">
              {isSent ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 text-4xl shadow-inner animate-bounce">
                    <i className="fas fa-paper-plane"></i>
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 mb-4">Message Sent!</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed font-light">
                    Oga/Madam, thank you for reaching out! Our team has received your message and we'll get back to you faster than a hot plate of Jollof.
                  </p>
                  <button 
                    onClick={() => setIsSent(false)}
                    className="text-green-700 font-black uppercase tracking-widest hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Send us a Note</h3>
                    <p className="text-gray-400 font-medium">We usually respond within a few business hours.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. Ebuka Jones" 
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="ebuka@email.com" 
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition font-medium" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                      <textarea 
                        required 
                        placeholder="Tell us what's on your mind..." 
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition font-medium h-48 resize-none"
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <button 
                        disabled={isSubmitting}
                        className="w-full bg-green-700 text-white py-6 rounded-2xl font-black text-xl hover:bg-green-800 transition transform active:scale-95 shadow-2xl flex items-center justify-center gap-4 disabled:bg-gray-400"
                      >
                        {isSubmitting ? (
                          <>Sending... <i className="fas fa-circle-notch animate-spin"></i></>
                        ) : (
                          <>Send Message <i className="fas fa-paper-plane text-sm"></i></>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Map Section */}
            <div className="bg-gray-100 rounded-[3rem] overflow-hidden h-80 border border-gray-100 relative group">
              <div className="absolute inset-0 bg-green-900/5 z-10 pointer-events-none group-hover:bg-transparent transition-all duration-700"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15858.986617260023!2d3.4244893!3d6.4267674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53280e4953f%3A0x1536979207865a6e!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1653841920000!5m2!1sen!2sng" 
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700" 
                loading="lazy"
                title="Restaurant Location"
              ></iframe>
              <div className="absolute bottom-6 right-6 z-20">
                 <a 
                   href="https://maps.google.com" 
                   target="_blank" 
                   className="bg-white/90 backdrop-blur px-6 py-3 rounded-full text-xs font-black text-green-900 shadow-xl hover:bg-yellow-500 transition-colors flex items-center gap-2"
                 >
                   <i className="fas fa-directions"></i> Open in Maps
                 </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
