'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Shield,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  SlidersHorizontal,
  LogOut,
  Lock,
  Eye,
  RefreshCw,
  Phone,
  MapPin,
  AlertCircle,
  X,
  Flame,
} from 'lucide-react';
import { Product, Order, OrderStatus, PaymentStatus, ContactInquiry } from '@/types';
import { formatPrice, formatDate, rupeesToPaise } from '@/lib/utils';

export default function AdminPage() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Tab: 'overview' | 'products' | 'orders' | 'inquiries'
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inquiries'>('overview');

  // Stats
  const [stats, setStats] = useState<{
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenuePaise: number;
  }>({
    totalProducts: 43,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenuePaise: 0,
  });

  // Data lists
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModal, setIsNewProductModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Form state for creating/editing product
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: 'veg' as 'veg' | 'non-veg',
    price_rupees: 150,
    package_weight_grams: 250,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    stock_quantity: 50,
    spice_level: 'Medium' as 'Mild' | 'Medium' | 'Spicy' | 'Extra Spicy',
    is_featured: false,
  });

  // Check existing token in sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('pickle_mart_admin_token');
    if (saved) {
      setAuthToken(saved);
    }
  }, []);

  // Fetch admin data once authenticated
  useEffect(() => {
    if (authToken) {
      fetchAllAdminData();
    }
  }, [authToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAuthToken(data.token);
        sessionStorage.setItem('pickle_mart_admin_token', data.token);
      } else {
        setAuthError(data.error || 'Invalid administrator password');
      }
    } catch (err) {
      setAuthError('Authentication request failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    sessionStorage.removeItem('pickle_mart_admin_token');
  };

  const fetchAllAdminData = async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      // Stats
      const statsRes = await fetch('/api/admin/stats', { headers });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      // Products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.success) setProducts(prodData.products);

      // Orders
      const orderRes = await fetch('/api/orders', { headers });
      const orderData = await orderRes.json();
      if (orderData.success) setOrders(orderData.orders);

      // Inquiries
      const inqRes = await fetch('/api/inquiries', { headers });
      const inqData = await inqRes.json();
      if (inqData.success) setInquiries(inqData.inquiries);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ is_available: !product.is_available }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_available: !p.is_available } : p))
        );
      }
    } catch (err) {
      alert('Failed to update product availability');
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pricePaise = rupeesToPaise(Number(productForm.price_rupees));
      const payload = {
        name: productForm.name,
        category_id: productForm.category_id,
        price_in_paise: pricePaise,
        package_weight_grams: Number(productForm.package_weight_grams) || 250,
        description: productForm.description,
        image_url: productForm.image_url,
        is_available: productForm.is_available,
        stock_quantity: Number(productForm.stock_quantity),
        spice_level: productForm.spice_level,
        is_featured: productForm.is_featured,
      };

      if (editingProduct) {
        // Edit existing
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setEditingProduct(null);
          fetchAllAdminData();
        }
      } else {
        // Create new
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsNewProductModal(false);
          fetchAllAdminData();
        }
      }
    } catch (err) {
      alert('Failed to save product');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from Pickle Mart?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ order_status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
        if (selectedOrderDetails?.id === orderId) {
          setSelectedOrderDetails((prev) => prev ? { ...prev, order_status: newStatus } : null);
        }
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Update payment status
  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ payment_status: paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, payment_status: paymentStatus } : o))
        );
        if (selectedOrderDetails?.id === orderId) {
          setSelectedOrderDetails((prev) => prev ? { ...prev, payment_status: paymentStatus } : null);
        }
      }
    } catch (err) {
      alert('Failed to update payment status');
    }
  };

  // Open Edit Product Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category_id: p.category_id,
      price_rupees: p.price_in_paise / 100,
      package_weight_grams: p.package_weight_grams,
      description: p.description,
      image_url: p.image_url,
      is_available: p.is_available,
      stock_quantity: p.stock_quantity,
      spice_level: p.spice_level || 'Medium',
      is_featured: !!p.is_featured,
    });
  };

  // Open Add Product Modal
  const openNewProductModal = () => {
    setIsNewProductModal(true);
    setEditingProduct(null);
    setProductForm({
      name: '',
      category_id: 'veg',
      price_rupees: 140,
      package_weight_grams: 250,
      description: 'Authentic traditional pickle freshly prepared with ground spices and cold-pressed oil.',
      image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      is_available: true,
      stock_quantity: 50,
      spice_level: 'Medium',
      is_featured: false,
    });
  };

  // LOGIN SCREEN
  if (!authToken) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-pickle-cream space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-pickle-red text-pickle-yellow rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-pickle-darkText">
              Pickle Mart Administration
            </h1>
            <p className="text-xs text-gray-500">
              Please enter the administrator secret password to access inventory and orders.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter administrator password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pickle-red/30"
                  required
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Default password: <code>admin123</code></p>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-pickle-red hover:bg-pickle-darkred text-white font-bold text-sm py-3 rounded-xl shadow-md transition-colors"
            >
              {authLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategory === 'all' || p.category_id === productCategory;
    const matchesSearch =
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.order_status === orderStatusFilter;
    const matchesSearch =
      orderSearch === '' ||
      o.order_reference.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="bg-pickle-darkred text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pickle-yellow text-pickle-darkred rounded-2xl flex items-center justify-center font-bold text-xl shadow">
            🏺
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-pickle-cream">
              Pickle Mart Store Management
            </h1>
            <p className="text-xs text-pickle-yellowLight">
              Logged in as Administrator • Authentic Grandma Recipes Control Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllAdminData}
            className="p-2.5 bg-pickle-red hover:bg-pickle-red/80 text-pickle-cream rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-pickle-red text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Dashboard Overview
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-pickle-red text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Product Management ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-pickle-red text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Order Management ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inquiries'
              ? 'bg-pickle-red text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Customer Inquiries ({inquiries.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-pickle-cream shadow-card">
              <span className="text-xs text-gray-500 font-semibold block">Total Revenue</span>
              <span className="font-serif text-2xl font-extrabold text-pickle-red mt-1 block">
                {formatPrice(stats.totalRevenuePaise)}
              </span>
              <span className="text-[11px] text-green-600 font-medium">From confirmed orders</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-pickle-cream shadow-card">
              <span className="text-xs text-gray-500 font-semibold block">Total Orders</span>
              <span className="font-serif text-2xl font-extrabold text-pickle-darkText mt-1 block">
                {orders.length}
              </span>
              <span className="text-[11px] text-gray-400">All customer orders</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-pickle-cream shadow-card">
              <span className="text-xs text-gray-500 font-semibold block">Pending / In Kitchen</span>
              <span className="font-serif text-2xl font-extrabold text-yellow-600 mt-1 block">
                {orders.filter((o) => o.order_status === 'Pending Confirmation' || o.order_status === 'Preparing').length}
              </span>
              <span className="text-[11px] text-gray-400">Needs packing</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-pickle-cream shadow-card">
              <span className="text-xs text-gray-500 font-semibold block">Delivered Orders</span>
              <span className="font-serif text-2xl font-extrabold text-green-700 mt-1 block">
                {orders.filter((o) => o.order_status === 'Delivered').length}
              </span>
              <span className="text-[11px] text-green-600">Successfully fulfilled</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-pickle-cream shadow-card">
              <span className="text-xs text-gray-500 font-semibold block">Catalog Pickles</span>
              <span className="font-serif text-2xl font-extrabold text-pickle-darkred mt-1 block">
                {products.length}
              </span>
              <span className="text-[11px] text-gray-500">22 Veg + 21 Non-Veg</span>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-pickle-cream space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-pickle-darkText">Recent Orders</h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-pickle-red hover:underline"
              >
                View All Orders →
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No customer orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-pickle-warmWhite text-pickle-darkText font-bold border-b">
                    <tr>
                      <th className="p-3">Ref #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Packs</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-pickle-red">{o.order_reference}</td>
                        <td className="p-3">
                          <span className="font-semibold">{o.customer_name}</span>
                          <span className="text-[11px] text-gray-400 block">{o.customer_phone}</span>
                        </td>
                        <td className="p-3">{o.items.length} items</td>
                        <td className="p-3 font-serif font-bold text-pickle-darkText">
                          {formatPrice(o.total_in_paise)}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pickle-cream text-pickle-darkred">
                            {o.order_status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400">{formatDate(o.created_at)}</td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedOrderDetails(o)}
                            className="text-pickle-red hover:underline font-bold"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls */}
          <div className="bg-white p-4 rounded-2xl border border-pickle-cream shadow-card flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pickle-red/30"
                />
              </div>

              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
              >
                <option value="all">All Categories</option>
                <option value="veg">Veg Pickles (22)</option>
                <option value="non-veg">Non-Veg Pickles (21)</option>
              </select>
            </div>

            <button
              onClick={openNewProductModal}
              className="flex items-center gap-1.5 bg-pickle-red hover:bg-pickle-darkred text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Pickle Variety</span>
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-3xl shadow-card border border-pickle-cream overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-pickle-warmWhite text-pickle-darkText font-bold border-b border-gray-100">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Package Size</th>
                    <th className="p-3">Price (250g)</th>
                    <th className="p-3">Availability</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => {
                    const isVeg = p.category_id === 'veg';
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 border">
                              <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={isVeg ? 'veg-badge' : 'non-veg-badge'} />
                                <span className="font-bold text-pickle-darkText">{p.name}</span>
                              </div>
                              <span className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                                {p.description}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 capitalize font-semibold">
                          {p.category_id === 'veg' ? 'Veg Pickles' : 'Non-Veg Pickles'}
                        </td>
                        <td className="p-3">{p.package_weight_grams} grams</td>
                        <td className="p-3 font-serif font-bold text-pickle-red text-sm">
                          {formatPrice(p.price_in_paise)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleAvailability(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                              p.is_available
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {p.is_available ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-pickle-cream shadow-card flex flex-wrap items-center justify-between gap-4">
            <div className="relative min-w-[260px] flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order Ref, Name, or Phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pickle-red/30"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-gray-500">Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
              >
                <option value="all">All Orders</option>
                <option value="Pending Confirmation">Pending Confirmation</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl shadow-card border border-pickle-cream overflow-hidden">
            {filteredOrders.length === 0 ? (
              <p className="text-xs text-gray-400 py-12 text-center">No orders matching your criteria.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-pickle-warmWhite text-pickle-darkText font-bold border-b border-gray-100">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items & Packaging</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-pickle-red">
                          {o.order_reference}
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-pickle-darkText">{o.customer_name}</p>
                          <p className="text-gray-400">{o.customer_phone}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-medium">{o.items.length} items</p>
                          <span className="text-[11px] text-gray-500 line-clamp-1 max-w-[200px]">
                            {o.items.map((i) => i.product_name_snapshot).join(', ')}
                          </span>
                        </td>
                        <td className="p-3 font-serif font-bold text-pickle-darkText text-sm">
                          {formatPrice(o.total_in_paise)}
                        </td>
                        <td className="p-3">
                          <select
                            value={o.payment_status}
                            onChange={(e) => handleUpdatePaymentStatus(o.id, e.target.value as PaymentStatus)}
                            className="text-[11px] font-semibold border rounded-lg px-2 py-1 bg-white capitalize"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <select
                            value={o.order_status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className="text-[11px] font-bold border rounded-lg px-2 py-1 bg-white text-pickle-red"
                          >
                            <option value="Pending Confirmation">Pending Confirmation</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-gray-400">{formatDate(o.created_at)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(o)}
                            className="px-2.5 py-1 text-xs font-bold text-pickle-red bg-pickle-cream rounded-lg hover:bg-pickle-yellow transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-card border border-pickle-cream p-6">
            <h2 className="font-serif text-xl font-bold text-pickle-darkText mb-4">
              Customer Contact Inquiries ({inquiries.length})
            </h2>

            {inquiries.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">No inquiries received yet.</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 rounded-2xl bg-pickle-warmWhite border border-pickle-cream text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-pickle-darkText font-bold text-sm">{inq.name}</strong>
                        <span className="text-gray-400">• +91 {inq.phone}</span>
                        {inq.email && <span className="text-gray-400">• {inq.email}</span>}
                      </div>
                      <span className="text-gray-400 text-[11px]">{formatDate(inq.created_at)}</span>
                    </div>
                    <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-100 leading-relaxed">
                      {inq.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {(editingProduct || isNewProductModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => { setEditingProduct(null); setIsNewProductModal(false); }} />
            <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pickle-cream space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif text-xl font-bold text-pickle-darkText">
                  {editingProduct ? 'Edit Pickle Variety' : 'Add New Pickle Variety'}
                </h3>
                <button
                  onClick={() => { setEditingProduct(null); setIsNewProductModal(false); }}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Pickle Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Category</label>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-xl bg-white text-sm"
                    >
                      <option value="veg">Veg Pickles</option>
                      <option value="non-veg">Non-Veg Pickles</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Price in Rupees (₹) for 250g</label>
                    <input
                      type="number"
                      value={productForm.price_rupees}
                      onChange={(e) => setProductForm({ ...productForm, price_rupees: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-bold text-pickle-red"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Package Weight (grams)</label>
                    <input
                      type="number"
                      value={productForm.package_weight_grams}
                      onChange={(e) => setProductForm({ ...productForm, package_weight_grams: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Spice Level</label>
                    <select
                      value={productForm.spice_level}
                      onChange={(e) => setProductForm({ ...productForm, spice_level: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-xl bg-white text-sm"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Spicy">Spicy</option>
                      <option value="Extra Spicy">Extra Spicy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                    required
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_available}
                      onChange={(e) => setProductForm({ ...productForm, is_available: e.target.checked })}
                      className="rounded text-pickle-red"
                    />
                    <span className="font-semibold">In Stock & Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                      className="rounded text-pickle-red"
                    />
                    <span className="font-semibold">Show in Featured / Bestsellers</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t">
                  <button
                    type="button"
                    onClick={() => { setEditingProduct(null); setIsNewProductModal(false); }}
                    className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-pickle-red hover:bg-pickle-darkred text-white font-bold rounded-xl shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedOrderDetails(null)} />
            <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pickle-cream space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-xs text-gray-500 font-mono">Ref: {selectedOrderDetails.order_reference}</span>
                  <h3 className="font-serif text-xl font-bold text-pickle-darkText">
                    Order from {selectedOrderDetails.customer_name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Controls */}
              <div className="grid grid-cols-2 gap-4 bg-pickle-warmWhite p-4 rounded-2xl border text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Fulfillment Status:</label>
                  <select
                    value={selectedOrderDetails.order_status}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrderDetails.id, e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 border rounded-xl bg-white font-bold text-pickle-red"
                  >
                    <option value="Pending Confirmation">Pending Confirmation</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Status:</label>
                  <select
                    value={selectedOrderDetails.payment_status}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrderDetails.id, e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 border rounded-xl bg-white font-bold"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Delivery info */}
              <div className="text-xs space-y-1 bg-gray-50 p-4 rounded-2xl">
                <p><strong>Mobile:</strong> +91 {selectedOrderDetails.customer_phone}</p>
                <p><strong>Address:</strong> {selectedOrderDetails.delivery_address}, {selectedOrderDetails.city} - {selectedOrderDetails.postal_code}</p>
                <p><strong>Payment Method:</strong> {selectedOrderDetails.payment_method.toUpperCase()}</p>
                {selectedOrderDetails.order_notes && (
                  <p><strong>Notes:</strong> {selectedOrderDetails.order_notes}</p>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-pickle-darkText">Ordered Items:</h4>
                <div className="border rounded-xl divide-y overflow-hidden">
                  {selectedOrderDetails.items.map((it) => (
                    <div key={it.id} className="p-3 flex justify-between">
                      <span>{it.quantity} × {it.product_name_snapshot} ({it.package_weight_grams}g)</span>
                      <span className="font-bold">{formatPrice(it.line_total_in_paise)}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right pt-2 space-y-1">
                  <p>Subtotal: {formatPrice(selectedOrderDetails.subtotal_in_paise)}</p>
                  <p>Delivery: {formatPrice(selectedOrderDetails.delivery_fee_in_paise)}</p>
                  <p className="font-serif font-bold text-base text-pickle-red">
                    Grand Total: {formatPrice(selectedOrderDetails.total_in_paise)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
