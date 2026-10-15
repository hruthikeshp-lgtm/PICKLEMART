import fs from 'fs';
import path from 'path';
import { Product, Category, Order, ContactInquiry, OrderStatus, PaymentStatus } from '@/types';
import { initialProducts, initialCategories } from '@/data/initialProducts';

interface StoreData {
  categories: Category[];
  products: Product[];
  orders: Order[];
  inquiries: ContactInquiry[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    const initialData: StoreData = {
      categories: initialCategories,
      products: initialProducts,
      orders: [],
      inquiries: [],
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readStore(): StoreData {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading store file, reinitializing:', error);
    const initialData: StoreData = {
      categories: initialCategories,
      products: initialProducts,
      orders: [],
      inquiries: [],
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function writeStore(data: StoreData): void {
  ensureDataFile();
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ---------------- PRODUCTS ----------------

export function getProducts(options?: {
  category?: string;
  search?: string;
  sort?: string;
  featuredOnly?: boolean;
}): Product[] {
  const store = readStore();
  let list = [...store.products];

  if (options?.category && options.category !== 'all') {
    list = list.filter((p) => p.category_id === options.category);
  }

  if (options?.featuredOnly) {
    list = list.filter((p) => p.is_featured);
  }

  if (options?.search && options.search.trim() !== '') {
    const term = options.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  if (options?.sort) {
    switch (options.sort) {
      case 'price-asc':
        list.sort((a, b) => a.price_in_paise - b.price_in_paise);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price_in_paise - a.price_in_paise);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
  }

  return list;
}

export function getProductById(id: string): Product | undefined {
  const store = readStore();
  return store.products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  const store = readStore();
  return store.products.find((p) => p.slug === slug);
}

export function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
  const store = readStore();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store.products.push(newProduct);
  writeStore(store);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const store = readStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.products[index] = {
    ...store.products[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  writeStore(store);
  return store.products[index];
}

export function deleteProduct(id: string): boolean {
  const store = readStore();
  const initialLength = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length !== initialLength) {
    writeStore(store);
    return true;
  }
  return false;
}

// ---------------- CATEGORIES ----------------

export function getCategories(): Category[] {
  const store = readStore();
  return store.categories;
}

// ---------------- ORDERS ----------------

export function getOrders(options?: {
  status?: string;
  search?: string;
}): Order[] {
  const store = readStore();
  let list = [...store.orders];

  if (options?.status && options.status !== 'all') {
    list = list.filter((o) => o.order_status === options.status);
  }

  if (options?.search && options.search.trim() !== '') {
    const term = options.search.trim().toLowerCase();
    list = list.filter(
      (o) =>
        o.order_reference.toLowerCase().includes(term) ||
        o.customer_name.toLowerCase().includes(term) ||
        o.customer_phone.includes(term)
    );
  }

  // Newest orders first
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return list;
}

export function getOrderById(id: string): Order | undefined {
  const store = readStore();
  return store.orders.find((o) => o.id === id);
}

export function getOrderByReference(reference: string): Order | undefined {
  const store = readStore();
  return store.orders.find(
    (o) => o.order_reference.toUpperCase() === reference.trim().toUpperCase()
  );
}

export function createOrder(order: Order): Order {
  const store = readStore();
  store.orders.unshift(order);
  writeStore(store);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const store = readStore();
  const order = store.orders.find((o) => o.id === id);
  if (!order) return null;

  order.order_status = status;
  order.updated_at = new Date().toISOString();
  writeStore(store);
  return order;
}

export function updatePaymentStatus(id: string, payment_status: PaymentStatus): Order | null {
  const store = readStore();
  const order = store.orders.find((o) => o.id === id);
  if (!order) return null;

  order.payment_status = payment_status;
  order.updated_at = new Date().toISOString();
  writeStore(store);
  return order;
}

// ---------------- INQUIRIES ----------------

export function getInquiries(): ContactInquiry[] {
  const store = readStore();
  return store.inquiries.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function createInquiry(data: Omit<ContactInquiry, 'id' | 'created_at'>): ContactInquiry {
  const store = readStore();
  const newInquiry: ContactInquiry = {
    ...data,
    id: `inq-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  store.inquiries.unshift(newInquiry);
  writeStore(store);
  return newInquiry;
}

// ---------------- STATS ----------------

export function getAdminStats() {
  const store = readStore();
  const totalProducts = store.products.length;
  const totalOrders = store.orders.length;
  const pendingOrders = store.orders.filter(
    (o) => o.order_status === 'Pending Confirmation' || o.order_status === 'Preparing'
  ).length;
  const completedOrders = store.orders.filter((o) => o.order_status === 'Delivered').length;

  // Calculate confirmed/active revenue (excluding cancelled)
  const totalRevenuePaise = store.orders
    .filter((o) => o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total_in_paise, 0);

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenuePaise,
  };
}
