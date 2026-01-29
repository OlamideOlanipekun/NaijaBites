
import { Dish, Testimonial, GalleryItem } from './types';

export const MENU_ITEMS: Dish[] = [
  {
    id: '1',
    name: 'Party Jollof Rice',
    price: 3500,
    category: 'Main',
    description: 'Smoky, authentic long-grain rice cooked in rich tomato and pepper sauce. Served with fried plantain and chicken.',
    image: 'https://images.unsplash.com/photo-1628102476629-f80511d273d2?auto=format&fit=crop&q=80&w=800',
    tags: ['Spicy', 'Chef Special']
  },
  {
    id: '2',
    name: 'Pounded Yam & Egusi Soup',
    price: 4500,
    category: 'Soups',
    description: 'Freshly pounded yam served with rich melon seed soup, assorted meat, and fish.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    tags: ['Gluten-Free']
  },
  {
    id: '3',
    name: 'Beef Suya (Naija Style)',
    price: 2500,
    category: 'Grills',
    description: 'Spicy grilled beef skewers coated in traditional Yaji spice. Served with onions and tomatoes.',
    image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800',
    tags: ['Spicy']
  },
  {
    id: '7',
    name: 'Golden Puff Puff',
    price: 1500,
    category: 'Starters',
    description: 'Deep-fried dough balls, soft, airy and sweet. A classic Nigerian street snack.',
    image: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&q=80&w=800',
    tags: ['Vegan']
  },
  {
    id: '4',
    name: 'Amala, Gbegiri & Ewedu',
    price: 4000,
    category: 'Soups',
    description: 'The legendary "Abula" - yam flour served with bean soup and jute leaves.',
    image: 'https://images.unsplash.com/photo-1604328699546-512c96c4a631?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Ewa Agoyin',
    price: 2200,
    category: 'Main',
    description: 'Extra soft mashed beans served with a signature dark spicy pepper sauce.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    tags: ['Vegan', 'Spicy']
  },
  {
    id: '6',
    name: 'Zobo Drink',
    price: 1000,
    category: 'Drinks',
    description: 'Refreshing chilled hibiscus flower infusion with ginger and pineapple hints.',
    image: 'https://images.unsplash.com/photo-1582211594533-268f4f1edeb9?auto=format&fit=crop&q=80&w=800',
    tags: ['Vegan', 'Gluten-Free']
  },
  {
    id: '8',
    name: 'Gizdodo',
    price: 3000,
    category: 'Starters',
    description: 'A delicious combination of gizzard and fried plantain tossed in spicy pepper sauce.',
    image: 'https://images.unsplash.com/photo-1604328701918-028f09071060?auto=format&fit=crop&q=80&w=800',
    tags: ['Spicy']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Chidi Okoro',
    role: 'Food Blogger',
    comment: 'The Jollof rice here is the closest thing to my mother\'s cooking back in Lagos. Truly authentic!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=chidi'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    role: 'Regular Customer',
    comment: 'Best Suya in town! The Yaji spice is just perfect. Also, the Zobo is incredibly refreshing.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: '3',
    name: 'Adebayo Tunde',
    role: 'Tech Lead',
    comment: 'Great atmosphere and even better food. The Amala is consistently soft and the Gbegiri is rich.',
    rating: 4,
    avatar: 'https://i.pravatar.cc/150?u=adebayo'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200', caption: 'The Heart of Victoria Island Dining', category: 'Ambiance' },
  { id: '2', url: 'https://images.unsplash.com/photo-1550966841-3ee5ad458e64?auto=format&fit=crop&q=80&w=1200', caption: 'Fire-Grilled Perfection: Suya Prep', category: 'Cuisine' },
  { id: '3', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200', caption: 'Authentic Spice Market Selection', category: 'Culture' },
  { id: '4', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200', caption: 'Hand-Picked Hibiscus for Zobo', category: 'Cuisine' },
  { id: '5', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200', caption: 'A Celebration of Grains and Spices', category: 'Cuisine' },
  { id: '6', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200', caption: 'Where Tradition Meets Modernity', category: 'Ambiance' },
  { id: '7', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1200', caption: 'Rich Textures of West Africa', category: 'Culture' },
  { id: '8', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200', caption: 'Event Hosting: Naija Style', category: 'Ambiance' }
];
