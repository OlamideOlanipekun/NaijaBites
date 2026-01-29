
import { Dish, Testimonial, GalleryItem } from './types.ts';

export const MENU_ITEMS: Dish[] = [
  {
    id: '1',
    name: 'Party Jollof Rice',
    price: 3500,
    category: 'Main',
    description: 'The legendary smoky long-grain rice, cooked in a rich reduction of tomatoes, peppers, and secret spices. Served with fried plantain.',
    image: 'https://images.unsplash.com/photo-1628102476629-f80511d273d2?auto=format&fit=crop&q=80&w=800',
    tags: ['Chef Special', 'Spicy']
  },
  {
    id: '2',
    name: 'Pounded Yam & Egusi',
    price: 4500,
    category: 'Soups',
    description: 'Silky smooth pounded yam paired with rich melon seed soup, fortified with spinach, stockfish, and assorted meats.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    tags: ['Chef Special']
  },
  {
    id: '3',
    name: 'Beef Suya Platter',
    price: 2800,
    category: 'Grills',
    description: 'Thinly sliced beef marinated in Yaji spice (kuli-kuli base), grilled over open flames. Served with onions and tomatoes.',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb025810f?auto=format&fit=crop&q=80&w=800',
    tags: ['Spicy']
  },
  {
    id: '4',
    name: 'Pepper Soup (Catfish)',
    price: 3200,
    category: 'Soups',
    description: 'Hot and soothing broth infused with aromatic African spices, herbs, and fresh catfish. A Lagos evening favorite.',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800',
    tags: ['Spicy', 'Gluten-Free']
  },
  {
    id: '5',
    name: 'Zobo House Special',
    price: 1200,
    category: 'Drinks',
    description: 'Chilled hibiscus flower extract infused with ginger, cloves, and a hint of pineapple. Natural and refreshing.',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=800',
    tags: ['Vegan', 'Gluten-Free']
  },
  {
    id: '6',
    name: 'Ewa Agoyin & Bread',
    price: 2500,
    category: 'Main',
    description: 'Mashed beans served with a notoriously spicy palm oil sauce and soft Agege bread. The ultimate comfort food.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    tags: ['Spicy', 'Vegan']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { 
    id: '1', 
    name: 'Chidi Okoro', 
    role: 'Food Critic', 
    comment: "The Smoky Jollof took me straight back to my grandmother's kitchen in Enugu. This is not just food; it is a time machine.", 
    rating: 5, 
    avatar: 'https://i.pravatar.cc/150?u=chidi' 
  },
  { 
    id: '2', 
    name: 'Sarah Williams', 
    role: 'Lagos Expat', 
    comment: "Best Suya in the city, hands down. The atmosphere is vibrant, and the spice level is perfectly authentic.", 
    rating: 5, 
    avatar: 'https://i.pravatar.cc/150?u=sarah' 
  },
  { 
    id: '3', 
    name: 'Tunde Bakare', 
    role: 'Digital Nomad', 
    comment: "Their AI assistant recommended the Ewa Agoyin when I asked for something spicy but hearty. It was spot on!", 
    rating: 5, 
    avatar: 'https://i.pravatar.cc/150?u=tunde' 
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', caption: 'The Grand Dining Room', category: 'Ambiance' },
  { id: '2', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd', caption: 'Hand-pounded Excellence', category: 'Cuisine' },
  { id: '3', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'The Art of Plating', category: 'Cuisine' },
  { id: '4', url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6', caption: 'Our Traditional Chefs', category: 'Culture' },
  { id: '5', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', caption: 'Morning Vibe at Naija Bites', category: 'Ambiance' },
  { id: '6', url: 'https://images.unsplash.com/photo-1603360946369-dc9bb025810f', caption: 'Street Style Suya Grills', category: 'Culture' }
];
