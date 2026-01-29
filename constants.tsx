
import { Dish, Testimonial, GalleryItem } from './types.ts';

export const MENU_ITEMS: Dish[] = [
  {
    id: '1',
    name: 'Party Jollof Rice',
    price: 3500,
    category: 'Main',
    description: 'Smoky, authentic long-grain rice cooked in rich tomato and pepper sauce.',
    image: 'https://images.unsplash.com/photo-1628102476629-f80511d273d2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Pounded Yam & Egusi Soup',
    price: 4500,
    category: 'Soups',
    description: 'Freshly pounded yam served with rich melon seed soup.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Chidi Okoro', role: 'Foodie', comment: 'Authentic!', rating: 5, avatar: 'https://i.pravatar.cc/150?u=chidi' }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', caption: 'Ambiance', category: 'Ambiance' }
];
