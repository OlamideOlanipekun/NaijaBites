
import React, { useEffect, useState } from 'react';
import { fetchMessages, markMessageRead } from '../../services/api';

const MessageManager: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        try {
            setLoading(true);
            const data = await fetchMessages(token);
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id: number) => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        try {
            await markMessageRead(token, id);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: 1 } : m));
        } catch (error) {
            alert('Failed to mark as read');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-black text-gray-800 mb-6">Contact Messages</h2>

            {loading ? (
                <div className="p-12 text-center"><i className="fas fa-spinner fa-spin text-3xl text-green-700"></i></div>
            ) : (
                <div className="space-y-4">
                    {messages.length === 0 ? <p className="text-gray-500">No messages found.</p> : null}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`bg-white p-6 rounded-3xl border ${msg.is_read ? 'border-gray-100 opacity-60' : 'border-green-100 shadow-sm'} transition hover:opacity-100`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold">
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{msg.subject}</h3>
                                        <p className="text-xs text-gray-500">{msg.name} &lt;{msg.email}&gt;</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block mb-1">
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </span>
                                    {msg.ip_address && (
                                        <span className="text-[10px] font-mono text-gray-300 block">IP: {msg.ip_address}</span>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{msg.message}</p>
                            {!msg.is_read && (
                                <button
                                    onClick={() => handleMarkRead(msg.id)}
                                    className="text-xs font-bold text-green-700 hover:text-green-800 uppercase tracking-wider"
                                >
                                    <i className="fas fa-check-circle mr-1"></i> Mark as Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageManager;
