
import React, { useEffect, useState } from 'react';
import { fetchAdminMenu, createDish, updateDish, deleteDish, uploadImage } from '../../services/api';
import { Dish } from '../../types';

const MenuManager: React.FC = () => {
    const [dishes, setDishes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState<any | null>(null);

    const loadMenu = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            setLoading(true);
            const data = await fetchAdminMenu(token);
            setDishes(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMenu();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this dish?')) return;

        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            await deleteDish(token, id);
            setDishes(prev => prev.filter(d => d.id !== id));
        } catch (err: any) {
            alert('Failed to delete: ' + err.message);
        }
    };

    const handleSave = async (dishData: any) => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            if (editingDish) {
                await updateDish(token, { ...dishData, id: editingDish.id });
            } else {
                await createDish(token, dishData);
            }
            setIsModalOpen(false);
            setEditingDish(null);
            loadMenu();
        } catch (err: any) {
            alert('Failed to save: ' + err.message);
        }
    };

    const openModal = (dish: any = null) => {
        setEditingDish(dish);
        setIsModalOpen(true);
    };

    if (loading) return <div className="flex justify-center p-12"><i className="fas fa-spinner fa-spin text-3xl text-green-700"></i></div>;
    if (error) return <div className="text-red-500 bg-red-50 p-6 rounded-2xl">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black text-gray-800">Menu Management</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition shadow-lg flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i> Add New Dish
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Image</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Name</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Category</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {dishes.map(dish => (
                                <tr key={dish.id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-6">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                                            <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="p-6 font-bold text-gray-700">{dish.name}</td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                            {dish.category_name}
                                        </span>
                                    </td>
                                    <td className="p-6 font-bold text-green-700">₦{Number(dish.price).toLocaleString()}</td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openModal(dish)}
                                                className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dish.id)}
                                                className="w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <DishModal
                    dish={editingDish}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

const DishModal: React.FC<{ dish: any, onClose: () => void, onSave: (data: any) => void }> = ({ dish, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '1',
        image_url: '',
        is_chef_special: false,
        tags: [] as string[]
    });

    useEffect(() => {
        if (dish) {
            setFormData({
                name: dish.name,
                description: dish.description,
                price: dish.price,
                category_id: dish.category_id,
                image_url: dish.image_url,
                is_chef_special: Boolean(dish.is_chef_special),
                tags: dish.tags || []
            });
        }
    }, [dish]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-800">{dish ? 'Edit Dish' : 'Add New Dish'}</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-green-600 font-bold"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Price (₦)</label>
                            <input
                                type="number"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-green-600 font-bold"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                        <textarea
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-green-600 font-medium h-32 resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-green-600 font-bold"
                                value={formData.category_id}
                                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                            >
                                <option value="1">Starters</option>
                                <option value="2">Main</option>
                                <option value="3">Soups</option>
                                <option value="4">Grills</option>
                                <option value="5">Drinks</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Image</label>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-green-600 font-medium text-xs"
                                        value={formData.image_url}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://... or upload below"
                                    />
                                </div>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const token = localStorage.getItem('adminToken');
                                            if (!token) return;

                                            try {
                                                const btn = document.getElementById('uploadBtnText');
                                                if (btn) btn.innerText = 'Uploading...';

                                                const url = await uploadImage(token, file);
                                                const fullUrl = `http://localhost/naijabites/public${url}`;
                                                setFormData(prev => ({ ...prev, image_url: fullUrl }));

                                                if (btn) btn.innerText = 'Upload New Image';
                                            } catch (err) {
                                                alert('Upload failed');
                                                if (document.getElementById('uploadBtnText')) {
                                                    document.getElementById('uploadBtnText')!.innerText = 'Upload New Image';
                                                }
                                            }
                                        }}
                                    />
                                    <div className="w-full bg-blue-50 text-blue-600 border border-blue-100 rounded-xl px-4 py-3 font-bold text-center flex items-center justify-center gap-2 group-hover:bg-blue-100 transition">
                                        <i className="fas fa-cloud-upload-alt"></i> <span id="uploadBtnText">Upload New Image</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                        <input
                            type="checkbox"
                            id="chefSpecial"
                            checked={formData.is_chef_special}
                            onChange={e => setFormData({ ...formData, is_chef_special: e.target.checked })}
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <label htmlFor="chefSpecial" className="font-bold text-gray-700 cursor-pointer">Chef Special</label>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-4 rounded-xl font-black uppercase tracking-widest bg-green-700 text-white hover:bg-green-800 transition shadow-lg active:scale-95"
                        >
                            Save Dish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuManager;
