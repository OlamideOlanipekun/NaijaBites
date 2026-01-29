
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getGeminiResponse } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome to Naija Bites! I am NaijaTaste AI. Hungry? I can recommend the perfect dish for you!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getGeminiResponse([...messages, userMsg]);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden border border-gray-200 animate-item-pop">
          <div className="bg-green-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner">
                <i className="fas fa-robot text-green-900 text-xs"></i>
              </div>
              <span className="font-black text-sm uppercase tracking-widest">NaijaTaste AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-yellow-400 transition">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div ref={scrollRef} className="h-72 md:h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-xs md:text-sm font-medium leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-green-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 text-[10px] md:text-xs font-black uppercase tracking-widest text-green-700 animate-pulse flex items-center gap-2">
                  <i className="fas fa-mortar-pestle animate-bounce"></i> Mixing flavors...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 md:p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for a dish..."
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs md:text-sm focus:ring-1 focus:ring-green-600 outline-none"
            />
            <button 
              onClick={handleSend}
              className="bg-green-700 text-white w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center hover:bg-green-800 transition active:scale-90 shadow-md shrink-0"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-green-700 hover:bg-green-800 text-white w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 group active:scale-95"
        >
          <i className="fas fa-comment-dots text-xl md:text-2xl group-hover:animate-bounce"></i>
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-green-950 text-[8px] font-black px-1.5 py-1 rounded-full border-2 border-white shadow-sm">AI</span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
