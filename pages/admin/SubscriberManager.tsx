
import React, { useEffect, useState } from 'react';
import { fetchSubscribers, toggleSubscriberStatus, deleteSubscriber, sendBulkEmail } from '../../services/api';

interface Subscriber {
    id: number;
    email: string;
    subscribed_at: string;
    is_active: number;
    ip_address?: string;
}

const SubscriberManager: React.FC = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ total: 0, active: 0 });

    // Bulk email state
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadSubscribers();
    }, []);

    const loadSubscribers = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            setLoading(true);
            const data = await fetchSubscribers(token);
            setSubscribers(data.subscribers);
            setStats({ total: data.total, active: data.active });
        } catch (err: any) {
            setError(err.message || 'Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: number) => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            await toggleSubscriberStatus(token, id);
            loadSubscribers();
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;

        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            await deleteSubscriber(token, id);
            loadSubscribers();
        } catch (err: any) {
            alert(err.message || 'Failed to delete subscriber');
        }
    };

    const handleSendBulkEmail = async () => {
        if (!emailSubject.trim() || !emailMessage.trim()) {
            alert('Subject and message are required');
            return;
        }

        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            setSending(true);
            const result = await sendBulkEmail(token, emailSubject, emailMessage);
            alert(`Success! ${result.note || 'Email queued for ' + result.count + ' subscribers'}`);
            setShowEmailModal(false);
            setEmailSubject('');
            setEmailMessage('');
        } catch (err: any) {
            alert(err.message || 'Failed to send emails');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><i className="fas fa-spinner fa-spin text-3xl text-green-700"></i></div>;
    if (error) return <div className="text-red-500 bg-red-50 p-6 rounded-2xl">{error}</div>;

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Subscribers</p>
                    <h3 className="text-3xl font-black text-gray-800">{stats.total}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Active</p>
                    <h3 className="text-3xl font-black text-green-600">{stats.active}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Unsubscribed</p>
                    <h3 className="text-3xl font-black text-gray-400">{stats.total - stats.active}</h3>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-800">Subscriber List</h2>
                <button
                    onClick={() => setShowEmailModal(true)}
                    className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition flex items-center gap-2"
                >
                    <i className="fas fa-paper-plane"></i> Send Bulk Email
                </button>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Email</th>
                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Subscribed</th>
                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
                            <th className="text-right px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map(sub => (
                            <tr key={sub.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-gray-800">{sub.email}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {new Date(sub.subscribed_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${sub.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {sub.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleToggleStatus(sub.id)}
                                        className="text-blue-600 hover:text-blue-800 font-bold text-sm mr-4"
                                    >
                                        {sub.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sub.id)}
                                        className="text-red-600 hover:text-red-800 font-bold text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {subscribers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    No subscribers yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bulk Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-800">Send Bulk Email</h3>
                            <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mb-6">
                            This will send an email to <strong className="text-green-700">{stats.active}</strong> active subscribers.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-600"
                                    placeholder="e.g. Special Offer from Naija Bites!"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Message</label>
                                <textarea
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    rows={6}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-600 resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="flex-1 bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendBulkEmail}
                                disabled={sending}
                                className="flex-1 bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {sending ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-paper-plane"></i> Send Email</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriberManager;
