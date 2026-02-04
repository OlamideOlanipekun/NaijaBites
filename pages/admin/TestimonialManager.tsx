
import React, { useEffect, useState } from 'react';
import { fetchAdminTestimonials, createTestimonial, updateTestimonial, toggleTestimonialStatus, deleteTestimonial } from '../../services/api';

const TestimonialManager: React.FC = () => {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        role: '',
        content: '',
        rating: 5,
        avatar_url: '',
        is_active: 1
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        try {
            setLoading(true);
            const data = await fetchAdminTestimonials(token);
            setTestimonials(data);
        } catch (error) {
            console.error('Failed to load testimonials', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            if (formData.id) {
                await updateTestimonial(token, formData.id, formData);
            } else {
                await createTestimonial(token, formData);
            }
            setShowModal(false);
            loadData();
            resetForm();
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleToggle = async (id: number) => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        try {
            await toggleTestimonialStatus(token, id);
            loadData();
        } catch (error) {
            alert('Failed to toggle status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this testimonial?')) return;
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        try {
            await deleteTestimonial(token, id);
            loadData();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleEdit = (item: any) => {
        setFormData({ ...item });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            id: 0,
            name: '',
            role: '',
            content: '',
            rating: 5,
            avatar_url: '',
            is_active: 1
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-800">Testimonials</h2>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition"
                >
                    <i className="fas fa-plus mr-2"></i> Add New
                </button>
            </div>

            {loading ? (
                <div className="p-12 text-center"><i className="fas fa-spinner fa-spin text-3xl text-green-700"></i></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group hover:shadow-md transition">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <img src={item.avatar_url || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-full object-cover" alt="avatar" />
                                <div>
                                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.role}</p>
                                    <p className="text-[10px] text-gray-300 font-mono mt-1">{item.ip_address || 'IP: N/A'}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic mb-4 line-clamp-3">"{item.content}"</p>
                            <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                                <div className="text-yellow-500 text-xs gap-1 flex">
                                    {[...Array(item.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                </div>
                                <button
                                    onClick={() => handleToggle(item.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    {item.is_active ? 'Visible' : 'Hidden'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-black text-gray-800 mb-6">{formData.id ? 'Edit Testimonial' : 'New Testimonial'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-600" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Role</label>
                                <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-600" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
                                <textarea required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Rating</label>
                                    <input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-600" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Avatar URL</label>
                                    <input value={formData.avatar_url} onChange={e => setFormData({ ...formData, avatar_url: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-600" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialManager;
