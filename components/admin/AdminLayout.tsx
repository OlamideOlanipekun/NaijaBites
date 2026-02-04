
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userString = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    useEffect(() => {
        if (!token || !userString) {
            if (location.pathname !== '/admin/login') {
                navigate('/admin/login', { replace: true });
            }
        } else {
            // If user is logged in and tries to access login page, redirect to dashboard
            if (location.pathname === '/admin/login') {
                navigate('/admin/dashboard', { replace: true });
            }
        }
    }, [token, userString, navigate, location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    // If upon login page, render children directly without layout
    if (location.pathname === '/admin/login') {
        return <>{children}</>;
    }

    // If not authenticated (and not on login page)
    if (!token && location.pathname !== '/admin/login') {
        return (
            <div className="min-h-screen bg-green-950 flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <span className="text-3xl font-black tracking-tighter text-white uppercase block mb-4">
                        NAIJA<span className="text-yellow-500 italic">BITES</span>
                    </span>
                    <p className="text-green-400/60 text-xs font-black uppercase tracking-widest">Redirecting to Login...</p>
                </div>
            </div>
        );
    }

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans selection:bg-yellow-200 selection:text-green-950">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 h-screen w-72 bg-green-950 text-white z-50 transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} shadow-2xl overflow-y-auto custom-scrollbar`}>
                <div className="p-8 border-b border-green-900/50">
                    <span className="text-2xl font-black tracking-tighter text-white uppercase block leading-none">
                        NAIJA<span className="text-yellow-500 italic">BITES</span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400/60 mt-2 block">Admin Console</span>
                </div>

                <nav className="p-6 space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/60 mb-4 px-4">Overview</div>
                    <NavItem to="/admin/dashboard" icon="fas fa-chart-pie" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />

                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/60 mb-4 px-4 mt-8">Management</div>
                    <NavItem to="/admin/menu" icon="fas fa-utensils" label="Menu Items" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/admin/reservations" icon="fas fa-calendar-alt" label="Reservations" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/admin/gallery" icon="fas fa-images" label="Gallery" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/admin/subscribers" icon="fas fa-users" label="Subscribers" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/admin/testimonials" icon="fas fa-comment-dots" label="Testimonials" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/admin/messages" icon="fas fa-envelope" label="Messages" onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem to="/admin/orders" icon="fas fa-receipt" label="Orders" isComingSoon onClick={() => setIsMobileMenuOpen(false)} />
                </nav>

                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-green-950 to-transparent">
                    <div className="bg-green-900/50 rounded-2xl p-4 border border-green-800/50 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-green-950 font-black text-sm">A</div>
                            <div>
                                <p className="text-sm font-bold text-white">Admin User</p>
                                <p className="text-[10px] text-green-400">Super Admin</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-bold text-sm"
                    >
                        <i className="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col relative">
                <header className="bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition"
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 capitalize tracking-tight">
                                {location.pathname.split('/').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Dashboard'}
                            </h2>
                            <p className="text-xs text-gray-400 font-medium hidden md:block">Welcome back to your control center</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition flex items-center justify-center relative">
                            <i className="fas fa-bell"></i>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <a href="/" target="_blank" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition">
                            View Website <i className="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </header>

                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem: React.FC<{ to: string, icon: string, label: string, onClick?: () => void, isComingSoon?: boolean }> = ({ to, icon, label, onClick, isComingSoon }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <button
            onClick={() => {
                if (!isComingSoon) {
                    navigate(to);
                    onClick?.();
                }
            }}
            disabled={isComingSoon}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm group relative overflow-hidden ${isActive
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-green-950 shadow-lg shadow-yellow-500/20 translate-x-2'
                : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                } ${isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className="flex items-center gap-4 relative z-10">
                <i className={`${icon} w-6 text-center ${isActive ? 'text-green-950' : 'group-hover:text-yellow-500 transition-colors'}`}></i>
                {label}
            </div>
            {isActive && <i className="fas fa-chevron-right text-xs opacity-50"></i>}
            {isComingSoon && <span className="text-[9px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-white/50">Soon</span>}
        </button>
    );
}

export default AdminLayout;
