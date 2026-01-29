
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types.ts';
import { getGeminiResponse } from '../services/geminiService.ts';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome! Hungry? I can recommend the perfect dish for you!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 flex flex-col overflow-hidden border">
          <div className="bg-green-700 p-4 flex justify-between items-center text-white font-bold">
            <span>NaijaTaste AI</span>
            <button onClick={() => setIsOpen(false)}><i className="fas fa-times"></i></button>
          </div>
          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-green-600 text-white' : 'bg-white shadow-sm border'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask me..." className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none" />
            <button onClick={handleSend} className="bg-green-700 text-white w-10 h-10 rounded-lg flex items-center justify-center"><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-green-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-xl">
          <i className="fas fa-robot"></i>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
