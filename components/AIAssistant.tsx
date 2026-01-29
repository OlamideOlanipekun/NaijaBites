
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types.ts';
import { getGeminiResponse } from '../services/geminiService.ts';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Kedu! I am NaijaTaste AI. Ready for the best meal of your life?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "What's the spiciest dish?",
    "Recommend a vegan option",
    "What's in the Egusi soup?",
    "Show me Chef specials"
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text: string = input) => {
    const msgToProcess = text.trim();
    if (!msgToProcess || isLoading) return;
    
    const userMsg: Message = { role: 'user', text: msgToProcess };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    const response = await getGeminiResponse([...messages, userMsg]);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] w-85 md:w-96 flex flex-col overflow-hidden border border-white/20 animate-scale-in origin-bottom-right">
          <div className="bg-green-800 p-6 flex justify-between items-center text-white font-black relative overflow-hidden">
            <div className="hero-pattern absolute inset-0 opacity-10"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 bg-yellow-500 rounded-2xl flex items-center justify-center text-green-950">
                 <i className="fas fa-robot"></i>
              </div>
              <div>
                <span className="block text-sm uppercase tracking-widest">NaijaTaste AI</span>
                <span className="block text-[8px] text-green-300 font-bold uppercase tracking-widest mt-0.5">Always Online o!</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="relative z-10 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div ref={scrollRef} className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50/50 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-green-700 text-white shadow-lg' 
                    : 'bg-white shadow-sm border border-gray-100 text-gray-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4">
              {quickPrompts.map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                placeholder="Ask me anything..." 
                className="flex-1 bg-gray-50 rounded-2xl px-6 py-4 text-sm outline-none border border-transparent focus:border-green-600 transition-all" 
              />
              <button 
                onClick={() => handleSend()} 
                className="bg-green-700 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl hover:bg-green-800 transition-all active:scale-90"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="relative group"
        >
          <div className="absolute inset-[-4px] bg-green-700/20 rounded-full animate-ping group-hover:bg-green-700/40"></div>
          <div className="relative bg-green-800 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center text-2xl transition-all duration-500 hover:rotate-12 hover:scale-110">
            <i className="fas fa-robot"></i>
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
