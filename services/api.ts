
import { Dish, CartItem } from '../types';

// API Base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/naijabites/backend/api';

// Paystack Public Key
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key_here';

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        // Only redirect if not already on the login page to avoid loops
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Menu API
export async function fetchMenu(category?: string, search?: string): Promise<Dish[]> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);

  const queryString = params.toString();
  const endpoint = `public/menu.php${queryString ? `?${queryString}` : ''}`;

  const response = await apiRequest<{ success: boolean; data: any[] }>(endpoint);

  // Map backend response to frontend Dish type
  return response.data.map(item => ({
    id: String(item.id),
    name: item.name,
    price: item.price,
    description: item.description,
    category: item.category,
    image: item.image,
    tags: item.tags,
  }));
}

// Reservation API
export interface ReservationData {
  guest_name: string;
  guest_email?: string;
  phone: string;
  date: string;
  time: string;
  guests_count: number;
  message?: string;
}

export async function createReservation(data: ReservationData): Promise<void> {
  await apiRequest('public/book_table.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Order API
export interface CreateOrderData {
  customer_email: string;
  items: CartItem[];
  total_amount: number;
}

export interface OrderResponse {
  reference: string;
  amount: number;
  email: string;
}

export async function createOrder(data: CreateOrderData): Promise<OrderResponse> {
  const response = await apiRequest<{ success: boolean; data: OrderResponse }>('public/orders/create_order.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function verifyPayment(reference: string): Promise<any> {
  const response = await apiRequest<{ success: boolean; data: any }>(`public/orders/verify_payment.php?reference=${reference}`);
  return response.data;
}

// Contact API
export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContact(data: ContactData): Promise<void> {
  await apiRequest('public/contact.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Newsletter Subscription
export async function subscribeNewsletter(email: string): Promise<void> {
  await apiRequest('public/subscribe.php', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Admin Auth API  
export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export async function adminLogin(data: LoginData): Promise<LoginResponse> {
  const response = await apiRequest<{ success: boolean; data: LoginResponse }>('admin/auth/login.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
}
// Admin Dashboard Stats
export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  pending_reservations: number;
  active_menu_items: number;
}

export async function fetchDashboardStats(token: string): Promise<DashboardStats> {
  const response = await apiRequest<{ success: boolean; data: DashboardStats }>('admin/dashboard_stats.php', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

// Admin Menu Operations
export async function fetchAdminMenu(token: string): Promise<any[]> {
  const response = await apiRequest<{ success: boolean; data: any[] }>('admin/menu_operations.php', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export async function createDish(token: string, data: any): Promise<void> {
  await apiRequest('admin/menu_operations.php', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
}

export async function updateDish(token: string, data: any): Promise<void> {
  await apiRequest('admin/menu_operations.php', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
}

export async function deleteDish(token: string, id: string): Promise<void> {
  await apiRequest(`admin/menu_operations.php?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

export async function uploadImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  // Use direct fetch to avoid Content-Type header override from apiRequest
  const url = `${API_BASE_URL}/admin/upload_image.php`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // DO NOT set Content-Type - browser will set it automatically with boundary
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data.data.url;
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
}

// Admin Reservations
export async function fetchReservations(token: string): Promise<any[]> {
  const response = await apiRequest<{ success: boolean; data: any[] }>('admin/reservations.php', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export async function updateReservationStatus(token: string, id: number, status: string): Promise<void> {
  await apiRequest('admin/reservations.php', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id, status })
  });
}

// Public Gallery
export async function fetchPublicGallery(category?: string): Promise<any[]> {
  const endpoint = category && category !== 'All'
    ? `public/gallery.php?category=${category}`
    : 'public/gallery.php';
  const response = await apiRequest<{ success: boolean; data: any[] }>(endpoint);
  return response.data;
}

// Admin Gallery
export async function fetchAdminGallery(token: string): Promise<any[]> {
  const response = await apiRequest<{ success: boolean; data: any[] }>('admin/gallery.php', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export async function createGalleryImage(token: string, data: any): Promise<void> {
  await apiRequest('admin/gallery.php', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
}

export async function updateGalleryImage(token: string, data: any): Promise<void> {
  await apiRequest('admin/gallery.php', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
}

export async function deleteGalleryImage(token: string, id: number): Promise<void> {
  await apiRequest(`admin/gallery.php?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

// Admin Subscriber Management
export async function fetchSubscribers(token: string): Promise<{ subscribers: any[], total: number, active: number }> {
  const response = await apiRequest<{ success: boolean; data: { subscribers: any[], total: number, active: number } }>('admin/subscribers.php', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export async function toggleSubscriberStatus(token: string, id: number): Promise<void> {
  await apiRequest('admin/subscribers.php', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id })
  });
}

export async function deleteSubscriber(token: string, id: number): Promise<void> {
  await apiRequest(`admin/subscribers.php?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

export async function sendBulkEmail(token: string, subject: string, message: string): Promise<{ count: number, note: string }> {
  const response = await apiRequest<{ success: boolean; data: { count: number, note: string } }>('admin/subscribers.php', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ subject, message })
  });
  return response.data;
}

// Testimonials API
export async function fetchTestimonials(): Promise<any[]> {
  const response = await apiRequest<{ success: boolean; data: any[] }>('public/testimonials.php');
  return response.data;
}

export async function fetchAdminTestimonials(token: string): Promise<any[]> {
  const response = await apiRequest<{ success: boolean; data: any[] }>('admin/testimonials.php', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

export async function createTestimonial(token: string, data: any): Promise<void> {
  await apiRequest('admin/testimonials.php', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}

export async function updateTestimonial(token: string, id: number, data: any): Promise<void> {
  await apiRequest('admin/testimonials.php', {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ ...data, id })
  });
}

export async function toggleTestimonialStatus(token: string, id: number): Promise<void> {
  await apiRequest('admin/testimonials.php', {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ id, toggle_status: true })
  });
}

export async function deleteTestimonial(token: string, id: number): Promise<void> {
  await apiRequest(`admin/testimonials.php?id=${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Contact Messages API
export async function fetchMessages(token: string): Promise<any[]> {
  const response = await apiRequest<{ success: boolean; data: any[] }>('admin/messages.php', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

export async function markMessageRead(token: string, id: number): Promise<void> {
  await apiRequest('admin/messages.php', {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ id })
  });
}
