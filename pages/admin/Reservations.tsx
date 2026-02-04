
import React, { useEffect, useState } from 'react';
import { fetchReservations, updateReservationStatus } from '../../services/api';

const Reservations: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadReservations = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            setLoading(true);
            const data = await fetchReservations(token);
            setReservations(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load reservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        if (!window.confirm(`Are you sure you want to mark this reservation as ${newStatus}?`)) return;

        try {
            await updateReservationStatus(token, id, newStatus);
            // Optimistic update
            setReservations(prev => prev.map(res =>
                res.id === id ? { ...res, status: newStatus } : res
            ));
        } catch (err: any) {
            alert('Failed to update status: ' + err.message);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><i className="fas fa-spinner fa-spin text-3xl text-green-700"></i></div>;
    if (error) return <div className="text-red-500 bg-red-50 p-6 rounded-2xl">{error}</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black text-gray-800">Reservations</h1>
                <div className="text-sm text-gray-500 font-bold">
                    Total: {reservations.length}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Date & Time</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Guest</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Details</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reservations.map(res => (
                                <tr key={res.id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-6">
                                        <div className="font-bold text-gray-700">{res.date}</div>
                                        <div className="text-sm text-gray-400">{res.time}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-gray-800">{res.guest_name}</div>
                                        <div className="text-xs text-gray-500">{res.guest_email}</div>
                                        <div className="text-xs text-gray-500">{res.phone}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-green-700">{res.guests_count} Guests</div>
                                        {res.message && (
                                            <div className="text-xs text-gray-400 mt-1 italic max-w-[200px] truncate" title={res.message}>
                                                "{res.message}"
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        {res.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                                                    className="w-10 h-10 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition flex items-center justify-center"
                                                    title="Confirm"
                                                >
                                                    <i className="fas fa-check"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(res.id, 'cancelled')}
                                                    className="w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center"
                                                    title="Cancel"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        )}
                                        {res.status !== 'pending' && (
                                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                                {res.status === 'confirmed' ? 'Booked' : 'Void'}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {reservations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                                        No reservations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
