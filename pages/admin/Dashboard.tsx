
import React, { useEffect, useState } from 'react';
import { fetchDashboardStats, DashboardStats } from '../../services/api';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadStats = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            try {
                const data = await fetchDashboardStats(token);
                setStats(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load stats');
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return <div className="flex justify-center p-12"><i className="fas fa-spinner fa-spin text-3xl text-green-700"></i></div>;
    if (error) return <div className="text-red-500 bg-red-50 p-6 rounded-2xl">{error}</div>;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                    label="Total Revenue"
                    value={`₦${stats?.total_revenue.toLocaleString()}`}
                    icon="fas fa-coins"
                    color="bg-yellow-500"
                />
                <StatCard
                    label="Active Orders"
                    value={stats?.total_orders.toString() || '0'}
                    icon="fas fa-shopping-basket"
                    color="bg-green-600"
                />
                <StatCard
                    label="Pending Reservations"
                    value={stats?.pending_reservations.toString() || '0'}
                    icon="fas fa-clock"
                    color="bg-blue-500"
                />
                <StatCard
                    label="Menu Items"
                    value={stats?.active_menu_items.toString() || '0'}
                    icon="fas fa-utensils"
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <i className="fas fa-check"></i>
                            </div>
                            <div>
                                <p className="font-bold text-gray-700">New Order Received</p>
                                <p className="text-xs text-gray-400">2 mins ago</p>
                            </div>
                            <span className="ml-auto font-black text-green-700">+₦12,500</span>
                        </div>
                        {/* Mock items for visual */}
                        <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <i className="fas fa-calendar"></i>
                            </div>
                            <div>
                                <p className="font-bold text-gray-700">Table Reservation</p>
                                <p className="text-xs text-gray-400">15 mins ago</p>
                            </div>
                            <span className="ml-auto font-black text-blue-700">4 Guests</span>
                        </div>
                    </div>
                </div>

                <div className="bg-green-900 p-8 rounded-3xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-2">System Status</h3>
                        <p className="text-green-200 text-sm mb-6">All systems operational</p>

                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/10 w-fit px-4 py-2 rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            Database Connected
                        </div>
                    </div>
                    <i className="fas fa-server text-9xl absolute -bottom-10 -right-10 text-white/5"></i>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ label: string, value: string, icon: string, color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition flex items-start justify-between">
        <div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-black text-gray-800">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shadow-lg`}>
            <i className={`${icon} text-lg`}></i>
        </div>
    </div>
);

export default Dashboard;
