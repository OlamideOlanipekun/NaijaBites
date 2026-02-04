
import React, { useEffect, useState, useRef } from 'react';
import { fetchAdminGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage, uploadImage } from '../../services/api';

interface GalleryImage {
    id: number;
    url: string;
    caption: string;
    category: 'Cuisine' | 'Ambiance' | 'Culture';
    sort_order: number;
}

const GalleryManager: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [formData, setFormData] = useState({ url: '', caption: '', category: 'Cuisine', sort_order: 0 });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadImages = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            setLoading(true);
            const data = await fetchAdminGallery(token);
            setImages(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load gallery');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadImages(); }, []);

    const openModal = (image?: GalleryImage) => {
        if (image) {
            setEditingImage(image);
            setFormData({ url: image.url, caption: image.caption, category: image.category, sort_order: image.sort_order });
        } else {
            setEditingImage(null);
            setFormData({ url: '', caption: '', category: 'Cuisine', sort_order: 0 });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            if (editingImage) {
                await updateGalleryImage(token, { id: editingImage.id, ...formData });
            } else {
                await createGalleryImage(token, formData);
            }
            setIsModalOpen(false);
            loadImages();
        } catch (err: any) {
            alert('Failed to save: ' + err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this image?')) return;
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            await deleteGalleryImage(token, id);
            loadImages();
        } catch (err: any) {
            alert('Failed to delete: ' + err.message);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            setUploading(true);
            const url = await uploadImage(token, file);
            setFormData(prev => ({ ...prev, url: `http://localhost/naijabites/public${url}` }));
        } catch (err: any) {
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><i className="fas fa-spinner fa-spin text-3xl text-green-700"></i></div>;
    if (error) return <div className="text-red-500 bg-red-50 p-6 rounded-2xl">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black text-gray-800">Gallery Manager</h1>
                <button onClick={() => openModal()} className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition flex items-center gap-2">
                    <i className="fas fa-plus"></i> Add Image
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map(img => (
                    <div key={img.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition">
                        <div className="relative h-48">
                            <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                                <button onClick={() => openModal(img)} className="w-10 h-10 rounded-lg bg-white/20 text-white hover:bg-white/30 transition">
                                    <i className="fas fa-pen"></i>
                                </button>
                                <button onClick={() => handleDelete(img.id)} className="w-10 h-10 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded-full">{img.category}</span>
                            <h4 className="font-bold text-gray-800 mt-2 truncate">{img.caption}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <i className="fas fa-images text-5xl mb-4"></i>
                    <p>No gallery images yet. Add your first one!</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-black text-gray-800">{editingImage ? 'Edit Image' : 'Add New Image'}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="https://..."
                                />
                                <div className="mt-2">
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-sm text-green-600 font-bold hover:underline"
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading...' : '⬆️ Or Upload Image'}
                                    </button>
                                </div>
                            </div>
                            {formData.url && (
                                <img src={formData.url} alt="Preview" className="w-full h-40 object-cover rounded-xl border" />
                            )}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Caption</label>
                                <input
                                    type="text"
                                    value={formData.caption}
                                    onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="e.g. The Grand Dining Room"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="Cuisine">Cuisine</option>
                                    <option value="Ambiance">Ambiance</option>
                                    <option value="Culture">Culture</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Sort Order</label>
                                <input
                                    type="number"
                                    value={formData.sort_order}
                                    onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-green-700 text-white font-bold hover:bg-green-800 transition">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
