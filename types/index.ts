export type CategoryType = 'veg' | 'non-veg';

export interface Category {
  id: CategoryType;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: CategoryType;
  description: string;
  price_in_paise: number; // e.g. 15000 for ₹150
  package_weight_grams: number; // default 250
  image_url: string;
  is_available: boolean;
  stock_quantity: number;
  is_featured?: boolean;
  spice_level?: 'Mild' | 'Medium' | 'Spicy' | 'Extra Spicy';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending Confirmation'
  | 'Confirmed'
  | 'Preparing'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'pay_at_store' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  unit_price_in_paise: number;
  package_weight_grams: number;
  quantity: number;
  line_total_in_paise: number;
}

export interface Order {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  postal_code: string;
  order_notes?: string;
  subtotal_in_paise: number;
  delivery_fee_in_paise: number;
  discount_in_paise: number;
  total_in_paise: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
}
