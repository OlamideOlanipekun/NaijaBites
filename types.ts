
export interface Dish {
  id: string;
  name: string;
  price: number;
  category: 'Main' | 'Soups' | 'Sides' | 'Grills' | 'Drinks' | 'Starters';
  description: string;
  image: string;
  tags?: ('Spicy' | 'Vegan' | 'Gluten-Free' | 'Chef Special')[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: 'Cuisine' | 'Ambiance' | 'Culture';
}

export interface CartItem extends Dish {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
