'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShoppingBag,
  TrendingUp,
  Package,
  Mail,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Send,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Sliders,
  DollarSign,
  AlertCircle,
  X,
  Lock,
  Upload,
  Palette,
  Link as LinkIcon,
  LayoutGrid,
  List,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Order, Product, AdminStats, EmailNotification, AdminSettings, OrderStatus, SizeStock } from '@/types';
import AdminDashboard from '@/components/admin/AdminDashboard';
import OrderCardMobile from '@/components/admin/OrderCardMobile';
import AdminBottomNav from '@/components/admin/AdminBottomNav';

interface CustomColorOption {
  name: string;
  hex: string;
}

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'emails' | 'products' | 'settings'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);

  // Orders view mode (cards on mobile by default)
  const [ordersViewMode, setOrdersViewMode] = useState<'cards' | 'table'>('cards');

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Selected Order for Modal/Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('DHL Express Insured');
  const [updatingOrder, setUpdatingOrder] = useState(false);

  // Email Preview Modal
  const [previewEmailHtml, setPreviewEmailHtml] = useState<string | null>(null);
  const [previewEmailTitle, setPreviewEmailTitle] = useState('');

  // Add Product Modal States
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductSubtitle, setNewProductSubtitle] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Product['category']>('outerwear');
  const [newProductPrice, setNewProductPrice] = useState(1200);
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductMaterials, setNewProductMaterials] = useState('');
  const [newProductStock, setNewProductStock] = useState(10);

  // Dynamic Image Inputs & Colors for Add
  const [productImagesList, setProductImagesList] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [productColorsList, setProductColorsList] = useState<CustomColorOption[]>([
    { name: 'Obsidian Black', hex: '#0a0a0a' },
    { name: 'Rich Cognac Brown', hex: '#5c4033' }
  ]);
  const [newColorNameInput, setNewColorNameInput] = useState('');
  const [newColorHexInput, setNewColorHexInput] = useState('#8b5cf6');

  // Add Product Size/Stock States
  const [productSizeStockList, setProductSizeStockList] = useState<SizeStock[]>([
    { size: '46 / S', stock: 3 },
    { size: '48 / M', stock: 3 },
    { size: '50 / L', stock: 3 },
    { size: '52 / XL', stock: 1 }
  ]);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newSizeStockInput, setNewSizeStockInput] = useState(5);

  // Edit Product Modal States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductSubtitle, setEditProductSubtitle] = useState('');
  const [editProductCategory, setEditProductCategory] = useState<Product['category']>('outerwear');
  const [editProductPrice, setEditProductPrice] = useState(1200);
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductMaterials, setEditProductMaterials] = useState('');
  const [editProductStock, setEditProductStock] = useState(10);
  const [editProductImagesList, setEditProductImagesList] = useState<string[]>([]);
  const [editImageUrlInput, setEditImageUrlInput] = useState('');
  const [editProductColorsList, setEditProductColorsList] = useState<CustomColorOption[]>([]);
  const [editColorNameInput, setEditColorNameInput] = useState('');
  const [editColorHexInput, setEditColorHexInput] = useState('#8b5cf6');

  // Edit Product Size/Stock States
  const [editSizeStockList, setEditSizeStockList] = useState<SizeStock[]>([]);
  const [editNewSizeInput, setEditNewSizeInput] = useState('');
  const [editNewSizeStockInput, setEditNewSizeStockInput] = useState(5);

  // Settings form
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [storeNameInput, setStoreNameInput] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  // Fetch all admin data (real-time)
  const fetchData = async (silent = false) => {
    try {
      if (!silent) setRefreshing(true);
      const [statsRes, ordersRes, productsRes, emailsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/admin/emails').then((r) => r.json()),
        fetch('/api/admin/settings').then((r) => r.json())
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (productsRes.success) setProducts(productsRes.products);
      if (emailsRes.success) setEmails(emailsRes.emails);
      if (settingsRes.success) {
        setSettings(settingsRes.settings);
        setAdminEmailInput(settingsRes.settings.adminEmail);
        setStoreNameInput(settingsRes.settings.storeName);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
      if (!silent) setRefreshing(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isSessionAuth = typeof window !== 'undefined' && sessionStorage.getItem('doue_admin_authenticated') === 'true';
        if (isSessionAuth) {
          setIsAuthenticated(true);
          fetchData();
          setAuthChecking(false);
          return;
        }

        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          if (typeof window !== 'undefined') sessionStorage.setItem('doue_admin_authenticated', 'true');
          fetchData();
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Periodic real-time background auto-sync every 20 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setAuthenticating(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid password');
      }

      setIsAuthenticated(true);
      if (typeof window !== 'undefined') sessionStorage.setItem('doue_admin_authenticated', 'true');
      fetchData();
    } catch (err: any) {
      setPasswordError(err.message || 'Access restricted. Invalid passkey.');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    if (typeof window !== 'undefined') sessionStorage.removeItem('doue_admin_authenticated');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Quick navigate helper
  const handleNavigateTab = (tab: 'dashboard' | 'orders' | 'emails' | 'products' | 'settings', filter?: string) => {
    setActiveTab(tab);
    if (filter) setStatusFilter(filter);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Image URL addition handlers
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setProductImagesList((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleAddEditImageUrl = () => {
    if (!editImageUrlInput.trim()) return;
    setEditProductImagesList((prev) => [...prev, editImageUrlInput.trim()]);
    setEditImageUrlInput('');
  };

  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
    setProductImagesList((prev) => [...prev, ...newImageUrls]);
  };

  const handleAddColorOption = () => {
    if (!newColorNameInput.trim()) return;
    setProductColorsList((prev) => [
      ...prev,
      { name: newColorNameInput.trim(), hex: newColorHexInput }
    ]);
    setNewColorNameInput('');
  };

  const handleEditDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
    setEditProductImagesList((prev) => [...prev, ...newImageUrls]);
  };

  const handleAddEditColorOption = () => {
    if (!editColorNameInput.trim()) return;
    setEditProductColorsList((prev) => [
      ...prev,
      { name: editColorNameInput.trim(), hex: editColorHexInput }
    ]);
    setEditColorNameInput('');
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditProductName(prod.name);
    setEditProductSubtitle(prod.subtitle || '');
    setEditProductCategory(prod.category);
    setEditProductPrice(prod.price);
    setEditProductDescription(prod.description || '');
    setEditProductMaterials(prod.materials || '');
    setEditProductStock(prod.stockCount || 10);
    setEditProductImagesList(prod.images || []);
    setEditProductColorsList(prod.colors || []);
    if (prod.sizeStock && prod.sizeStock.length > 0) {
      setEditSizeStockList(prod.sizeStock);
    } else {
      const sizes = prod.sizes && prod.sizes.length > 0 ? prod.sizes : ['46 / S', '48 / M', '50 / L', '52 / XL'];
      const perSize = sizes.length > 0 ? Math.max(1, Math.round((prod.stockCount || 10) / sizes.length)) : 5;
      setEditSizeStockList(sizes.map((s) => ({ size: s, stock: perSize })));
    }
    setEditNewSizeInput('');
    setEditNewSizeStockInput(5);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (editProductImagesList.length === 0) {
      alert('Please keep or upload at least one image URL.');
      return;
    }

    try {
      const totalStock = editSizeStockList.reduce((sum, s) => sum + s.stock, 0);
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editProductName,
          subtitle: editProductSubtitle,
          category: editProductCategory,
          price: Number(editProductPrice),
          description: editProductDescription,
          materials: editProductMaterials,
          images: editProductImagesList,
          sizes: editSizeStockList.map((s) => s.size),
          sizeStock: editSizeStockList,
          colors: editProductColorsList,
          stockCount: totalStock,
          inStock: totalStock > 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        fetchData();
      } else {
        alert(data.error || 'Failed to update product');
      }
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingOrder(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber.trim() || undefined,
          carrier: carrier.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        fetchData();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setUpdatingOrder(false);
    }
  };

  const handleResendNotification = async (orderId: string) => {
    try {
      const res = await fetch('/api/admin/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'resend' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Notification email successfully resent to all designated admin emails!');
        fetchData();
      }
    } catch (err) {
      alert('Failed to resend notification');
    }
  };

  const handlePreviewEmail = async (orderId: string, recipientType: 'admin' | 'customer' = 'admin') => {
    try {
      const res = await fetch('/api/admin/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'preview', recipientType })
      });
      const data = await res.json();
      if (data.success) {
        setPreviewEmailHtml(data.html);
        setPreviewEmailTitle(`Rendered HTML Email Preview (${recipientType.toUpperCase()} ALERT)`);
      }
    } catch (err) {
      console.error('Failed to load email preview:', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: adminEmailInput.trim(),
          storeName: storeNameInput.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSettingsSuccess('Notification settings successfully updated. All listed admin emails will now receive order alerts.');
        setTimeout(() => setSettingsSuccess(''), 4000);
      }
    } catch (err) {
      alert('Error saving settings');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productImagesList.length === 0) {
      alert('Please add at least one image URL for this luxury piece.');
      return;
    }
    try {
      const totalStock = productSizeStockList.reduce((sum, s) => sum + s.stock, 0);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          subtitle: newProductSubtitle,
          category: newProductCategory,
          price: Number(newProductPrice),
          description: newProductDescription,
          materials: newProductMaterials,
          images: productImagesList,
          sizes: productSizeStockList.map((s) => s.size),
          sizeStock: productSizeStockList,
          colors: productColorsList,
          stockCount: totalStock,
          inStock: totalStock > 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddProductModal(false);
        setNewProductName('');
        setNewProductSubtitle('');
        setProductImagesList([]);
        setImageUrlInput('');
        setProductColorsList([
          { name: 'Obsidian Black', hex: '#0a0a0a' },
          { name: 'Rich Cognac Brown', hex: '#5c4033' }
        ]);
        setProductSizeStockList([
          { size: '46 / S', stock: 3 },
          { size: '48 / M', stock: 3 },
          { size: '50 / L', stock: 3 },
          { size: '52 / XL', stock: 1 }
        ]);
        setNewSizeInput('');
        fetchData();
      }
    } catch (err) {
      alert('Failed to create product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this piece from the catalog?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNumber?: string) => {
    const ref = orderNumber || orderId;
    if (!confirm(`Are you sure you want to permanently delete order ${ref}? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
        fetchData();
      } else {
        alert(data.error || 'Failed to delete order');
      }
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  // Filter orders by query & status
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesQuery =
      !orderSearch.trim() ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  if (authChecking) {
    return (
      <div style={{ minHeight: '100vh', background: '#070709', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 44, height: 44, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  // 0. AUTHENTICATION LOCK SCREEN (MOBILE RESPONSIVE)
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#070709',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 8,
          padding: '36px 24px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.85)',
          textAlign: 'center'
        }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px auto'
          }}>
            <Lock size={22} color="#ffffff" />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            ATELIER VAULT RESTRICTED
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.12em', color: '#fff', margin: '6px 0 10px 0' }}>
            ADMINISTRATIVE ACCESS
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
            Authenticate with atelier passkey to access operational fulfillment, real-time dashboard, and catalog.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter admin passkey..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 16,
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 4,
                  color: '#fff'
                }}
              />
            </div>

            {passwordError && (
              <div style={{ color: '#fca5a5', fontSize: 12, marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              disabled={authenticating}
              className="btn-luxury touch-target"
              style={{ width: '100%', padding: '14px', fontSize: 12, marginBottom: 14, borderRadius: 4 }}
            >
              {authenticating ? 'AUTHENTICATING...' : 'UNLOCK ATELIER VAULT'}
            </button>

            <Link
              href="/"
              className="touch-target"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={12} />
              <span>RETURN TO BOUTIQUE</span>
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // MAIN ADMIN PORTAL (100% MOBILE RESPONSIVE)
  return (
    <div style={{ minHeight: '100vh', background: '#070709', color: '#fcfcfd', position: 'relative' }}>

      {/* Responsive Inline CSS Fixes */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .admin-top-header {
            padding: 10px 14px !important;
          }
          .admin-header-actions span {
            display: none !important;
          }
          .admin-desktop-tabs {
            display: none !important;
          }
          .admin-mobile-tab-scroll {
            display: flex !important;
          }
          .admin-container {
            padding: 14px 12px 100px 12px !important;
          }
          .admin-products-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .admin-modal-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 20px 16px !important;
          }
        }

        @media (min-width: 769px) {
          .admin-mobile-tab-scroll {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Mobile-First App Header Bar */}
      <header
        className="admin-top-header"
        style={{
          background: 'rgba(14, 14, 18, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/"
            className="btn-icon touch-target"
            style={{ width: 36, height: 36, borderRadius: 4 }}
            title="Return to Main Boutique Storefront"
          >
            <ArrowLeft size={16} />
          </Link>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={17} color="#ffffff" />
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                letterSpacing: '0.12em',
                fontWeight: 600,
                color: '#fff',
                whiteSpace: 'nowrap'
              }}>
                DOUÈ &bull; ADMIN
              </h1>
              <span className="live-pulse-dot" style={{ width: 6, height: 6 }} />
            </div>
          </div>
        </div>

        <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => fetchData()}
            disabled={refreshing}
            className="btn-luxury-outline touch-target"
            style={{ padding: '8px 12px', fontSize: 11, gap: 6, borderRadius: 4 }}
            title="Refresh Real-Time Data"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>SYNC</span>
          </button>

          <Link
            href="/"
            className="btn-luxury touch-target"
            style={{ padding: '8px 14px', fontSize: 11, gap: 6, borderRadius: 4 }}
            title="Open Boutique"
          >
            <ShoppingBag size={13} />
            <span>STOREFRONT</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn-luxury-outline touch-target"
            style={{
              padding: '8px 12px',
              fontSize: 11,
              borderColor: 'rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              borderRadius: 4
            }}
            title="Lock Vault & Logout"
          >
            <Lock size={13} />
            <span>LOCK</span>
          </button>
        </div>
      </header>

      {/* Main Admin Container */}
      <div className="container admin-container admin-content-pad-bottom" style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Desktop & Tablet Segmented Tab Bar */}
        <div className="admin-desktop-tabs" style={{
          display: 'flex',
          gap: 6,
          borderBottom: '1px solid var(--border-medium)',
          marginBottom: 24,
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'dashboard' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            <TrendingUp size={14} />
            <span>DASHBOARD & STATS</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'orders' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'orders' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={14} />
            <span>ORDERS ({orders.length})</span>
            {stats && stats.pendingOrders > 0 && (
              <span style={{ background: '#f59e0b', color: '#000', fontSize: 10, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>
                {stats.pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'products' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'products' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            <Package size={14} />
            <span>CATALOG ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'emails' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'emails' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            <Mail size={14} />
            <span>EMAILS ({emails.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'settings' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'settings' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer'
            }}
          >
            <Sliders size={14} />
            <span>SETTINGS</span>
          </button>
        </div>

        {/* Mobile Horizontal Pill Scroll Tabs */}
        <div
          className="admin-mobile-tab-scroll no-scrollbar"
          style={{
            gap: 8,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            paddingBottom: 12,
            marginBottom: 16,
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag, badge: stats?.pendingOrders },
            { id: 'products', label: `Catalog (${products.length})`, icon: Package },
            { id: 'emails', label: `Emails (${emails.length})`, icon: Mail },
            { id: 'settings', label: 'Settings', icon: Sliders }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#000000' : 'var(--text-secondary)',
                  border: isActive ? '1px solid #fff' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Icon size={13} />
                <span>{t.label}</span>
                {t.badge && t.badge > 0 ? (
                  <span style={{
                    background: isActive ? '#000' : '#f59e0b',
                    color: isActive ? '#fff' : '#000',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: 8
                  }}>
                    {t.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* TAB 1: REAL-TIME DASHBOARD */}
        {activeTab === 'dashboard' && (
          <AdminDashboard
            stats={stats}
            orders={orders}
            products={products}
            refreshing={refreshing}
            onRefresh={() => fetchData()}
            onNavigateTab={handleNavigateTab}
            onSelectOrder={(order) => {
              setSelectedOrder(order);
              setNewStatus(order.status);
              setTrackingNumber(order.trackingNumber || '');
              setCarrier(order.carrier || 'DHL Express Insured');
            }}
            onOpenAddProduct={() => setShowAddProductModal(true)}
          />
        )}

        {/* TAB 2: ORDERS & DETAILS (DUAL VIEW: MOBILE CARDS & TABLE) */}
        {activeTab === 'orders' && (
          <div>
            {/* Orders Header: Search, Filters, and View Mode Toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {/* Search Box */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 4,
                  padding: '0 12px',
                  flexGrow: 1,
                  maxWidth: 500
                }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search by order #, client name, email..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      fontSize: 14,
                      outline: 'none',
                      color: '#fff',
                      padding: '10px 8px'
                    }}
                  />
                  {orderSearch && (
                    <button
                      type="button"
                      onClick={() => setOrderSearch('')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* View Switcher: Cards vs Table */}
                <div style={{
                  display: 'inline-flex',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 6,
                  padding: 2
                }}>
                  <button
                    type="button"
                    onClick={() => setOrdersViewMode('cards')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 10px',
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      borderRadius: 4,
                      background: ordersViewMode === 'cards' ? '#fff' : 'transparent',
                      color: ordersViewMode === 'cards' ? '#000' : 'var(--text-muted)',
                      fontWeight: 600
                    }}
                    title="Mobile Card View"
                  >
                    <LayoutGrid size={13} />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrdersViewMode('table')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 10px',
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      borderRadius: 4,
                      background: ordersViewMode === 'table' ? '#fff' : 'transparent',
                      color: ordersViewMode === 'table' ? '#000' : 'var(--text-muted)',
                      fontWeight: 600
                    }}
                    title="Desktop Table View"
                  >
                    <List size={13} />
                    <span>Table</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Chips (Horizontally Scrollable) */}
              <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      background: statusFilter === st ? 'var(--text-primary)' : 'var(--bg-card)',
                      color: statusFilter === st ? 'var(--bg-deep)' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {st} {st !== 'all' && `(${orders.filter((o) => o.status === st).length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 ? (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '48px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                <ShoppingBag size={32} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
                <p style={{ fontSize: 14 }}>No orders match the current filter criteria.</p>
                <button
                  onClick={() => { setOrderSearch(''); setStatusFilter('all'); }}
                  className="btn-luxury-outline"
                  style={{ marginTop: 14, padding: '8px 16px', fontSize: 11 }}
                >
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <>
                {/* 1. Mobile Cards View (Active on mobile or when toggled) */}
                {ordersViewMode === 'cards' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filteredOrders.map((order) => (
                      <OrderCardMobile
                        key={order.id}
                        order={order}
                        currency={settings?.currency || 'EGP'}
                        onSelect={(ord) => {
                          setSelectedOrder(ord);
                          setNewStatus(ord.status);
                          setTrackingNumber(ord.trackingNumber || '');
                          setCarrier(ord.carrier || 'DHL Express Insured');
                        }}
                        onPreviewEmail={(orderId) => handlePreviewEmail(orderId, 'admin')}
                        onDelete={handleDeleteOrder}
                      />
                    ))}
                  </div>
                ) : (
                  /* 2. Desktop Table View with Touch Scroll */
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ORDER REF</th>
                          <th>DATE & TIME</th>
                          <th>CLIENT</th>
                          <th>PIECES</th>
                          <th>TOTAL</th>
                          <th>ORDER STATUS</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus(order.status);
                              setTrackingNumber(order.trackingNumber || '');
                              setCarrier(order.carrier || 'DHL Express Insured');
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>
                              {order.orderNumber}
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                              {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{order.customer.firstName} {order.customer.lastName}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{order.customer.email}</div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {order.items.slice(0, 3).map((item, i) => (
                                  <div key={i} style={{ width: 28, height: 36, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                                    <img src={item.image} alt="piece" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    +{order.items.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>
                              {Number(order.total || 0).toLocaleString()} EGP
                            </td>
                            <td>
                              <span className={`status-pill ${order.status}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setNewStatus(order.status);
                                    setTrackingNumber(order.trackingNumber || '');
                                    setCarrier(order.carrier || 'DHL Express Insured');
                                  }}
                                  className="btn-luxury-outline touch-target"
                                  style={{ padding: '6px 12px', fontSize: 10 }}
                                >
                                  MANAGE
                                </button>
                                <button
                                  onClick={() => handlePreviewEmail(order.id, 'admin')}
                                  className="btn-icon touch-target"
                                  style={{ width: 32, height: 32 }}
                                  title="Preview Email Sent to Admin"
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                                  className="btn-icon touch-target"
                                  style={{ width: 32, height: 32, color: '#fca5a5' }}
                                  title="Delete Order"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCT CATALOG */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.1em' }}>
                  ATELIER CATALOG ({products.length} PIECES)
                </h3>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Manage luxury garments, pricing, high-res photos, and stock
                </span>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="btn-luxury touch-target"
                style={{ padding: '10px 18px', fontSize: 11, borderRadius: 4 }}
              >
                <Plus size={14} />
                <span>ADD NEW LUXURY PIECE</span>
              </button>
            </div>

            <div className="admin-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {products.map((prod) => (
                <div key={prod.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', width: '100%', height: 260 }}>
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.85)', padding: '4px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'var(--font-mono)' }}>
                      {prod.category.toUpperCase()}
                    </span>
                    <span style={{ position: 'absolute', bottom: 10, right: 10, background: prod.stockCount > 0 ? '#10b981' : '#ef4444', color: '#000', padding: '3px 8px', borderRadius: 2, fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {prod.stockCount} IN STOCK
                    </span>
                  </div>

                  <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                      {prod.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      {prod.subtitle}
                    </div>

                    {/* Per-size stock breakdown */}
                    {prod.sizeStock && prod.sizeStock.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                        {prod.sizeStock.map((ss, i) => (
                          <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '2px 7px', borderRadius: 3,
                            background: ss.stock === 0 ? 'rgba(239,68,68,0.1)' : ss.stock <= 2 ? 'rgba(234,179,8,0.1)' : 'rgba(16,185,129,0.1)',
                            border: `1px solid ${ss.stock === 0 ? 'rgba(239,68,68,0.3)' : ss.stock <= 2 ? 'rgba(234,179,8,0.3)' : 'rgba(16,185,129,0.3)'}`,
                            fontSize: 10,
                            fontFamily: "var(--font-mono)",
                            color: ss.stock === 0 ? '#fca5a5' : ss.stock <= 2 ? '#fde047' : '#6ee7b7'
                          }}>
                            <span>{ss.size}</span>
                            <span style={{ opacity: 0.7 }}>·</span>
                            <span>{ss.stock}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                        {(prod.sizes || []).map((sz, i) => (
                          <span key={i} style={{ padding: '2px 7px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                            {sz}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700 }}>
                        {Number(prod.price || 0).toLocaleString()} EGP
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="btn-luxury-outline touch-target"
                          style={{ padding: '6px 12px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4, borderRadius: 4 }}
                          title="Edit Product"
                        >
                          <Edit size={12} />
                          <span>EDIT</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="btn-icon touch-target"
                          style={{ width: 36, height: 36, color: '#fca5a5', borderRadius: 4 }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EMAIL DISPATCH LOGS */}
        {activeTab === 'emails' && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 6, padding: '18px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em' }}>
                  MULTI-ADMIN NOTIFICATION DISPATCHER
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Every acquisition automatically triggers responsive HTML emails to all designated administrators (<span style={{ color: '#fff' }}>{settings?.adminEmail}</span>).
                </p>
              </div>

              {orders.length > 0 && (
                <button
                  onClick={() => handleResendNotification(orders[0].id)}
                  className="btn-luxury touch-target"
                  style={{ padding: '10px 18px', fontSize: 11, borderRadius: 4 }}
                >
                  <Send size={13} />
                  <span>DISPATCH TEST ALERT</span>
                </button>
              )}
            </div>

            {/* Email Logs on Mobile as Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {emails.length === 0 ? (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No email notifications logged yet. Placing an order on the boutique storefront triggers real-time email dispatch!
                </div>
              ) : (
                emails.map((em) => (
                  <div
                    key={em.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 6,
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff', fontSize: 13 }}>
                          {em.orderNumber}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          background: em.type === 'admin_new_order' ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.1)',
                          borderRadius: 4,
                          fontSize: 9,
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase'
                        }}>
                          {em.type === 'admin_new_order' ? 'ADMIN ALERT' : 'CUSTOMER RECEIPT'}
                        </span>
                      </div>

                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(em.sentAt).toLocaleDateString()} {new Date(em.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
                      {em.subject}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        To: {em.recipientEmail}
                      </span>

                      <button
                        onClick={() => {
                          if (em.contentHtml) {
                            setPreviewEmailHtml(em.contentHtml);
                            setPreviewEmailTitle(`Email Log (${em.subject})`);
                          } else {
                            handlePreviewEmail(em.orderId, em.type === 'admin_new_order' ? 'admin' : 'customer');
                          }
                        }}
                        className="btn-luxury-outline touch-target"
                        style={{ padding: '6px 12px', fontSize: 10, borderRadius: 4 }}
                      >
                        <Eye size={12} />
                        <span>PREVIEW</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: NOTIFICATION SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 6, padding: '24px 20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.12em', marginBottom: 6 }}>
                ADMIN NOTIFICATION CONFIGURATION
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
                Configure recipient emails for luxury order alerts. Multiple admin emails can be separated by commas (e.g. <span style={{ color: '#fff' }}>doueprojecteg@gmail.com</span>).
              </p>

              <form onSubmit={handleSaveSettings}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6 }}>
                    ADMIN RECIPIENT EMAIL ADDRESS(ES) *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    placeholder="doueprojecteg@gmail.com"
                    style={{
                      width: '100%',
                      fontSize: 16,
                      padding: '12px 14px',
                      color: '#fff',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 4
                    }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, display: 'block' }}>
                    All listed admins will instantly receive high-value order alerts upon checkout.
                  </span>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6 }}>
                    ATELIER BRAND / STORE NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={storeNameInput}
                    onChange={(e) => setStoreNameInput(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: 16,
                      padding: '12px 14px',
                      color: '#fff',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 4
                    }}
                  />
                </div>

                {settingsSuccess && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10b981',
                    color: '#6ee7b7',
                    borderRadius: 4,
                    fontSize: 12,
                    marginBottom: 20,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {settingsSuccess}
                  </div>
                )}

                <button type="submit" className="btn-luxury touch-target" style={{ width: '100%', padding: '14px', fontSize: 11, borderRadius: 4 }}>
                  SAVE NOTIFICATION SETTINGS
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* FIXED MOBILE BOTTOM NAVIGATION BAR */}
      <AdminBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigateTab(tab)}
        pendingOrdersCount={stats?.pendingOrders}
        totalProductsCount={products.length}
      />

      {/* ============================================================== */}
      {/* MODAL 1: ORDER DETAIL & FULFILLMENT (MOBILE BOTTOM SHEET)       */}
      {/* ============================================================== */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 840, padding: 0, overflow: 'hidden' }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#0e0e12',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
                  ACQUISITION MANAGEMENT
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.1em', marginTop: 2 }}>
                  ORDER #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-icon touch-target" style={{ width: 36, height: 36 }}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div
              className="admin-modal-grid"
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: 24,
                maxHeight: 'calc(92vh - 70px)',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 10 }}>
                  CLIENT & SHIPPING DESTINATION
                </h4>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                      {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </div>
                    {selectedOrder.customer.phone && (
                      <a
                        href={`tel:${selectedOrder.customer.phone}`}
                        style={{
                          fontSize: 11,
                          fontFamily: 'var(--font-mono)',
                          color: '#6ee7b7',
                          padding: '4px 8px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          borderRadius: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Phone size={11} />
                        <span>CALL</span>
                      </a>
                    )}
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                    {selectedOrder.customer.email}<br />
                    {selectedOrder.shippingAddress.address} {selectedOrder.shippingAddress.apartment}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                  </div>
                </div>

                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 10 }}>
                  PIECES ORDERED ({selectedOrder.items.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, padding: 10, background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ width: 44, height: 56, flexShrink: 0, borderRadius: 2, overflow: 'hidden' }}>
                        <img src={it.image} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {it.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                          Size: {it.size} &bull; Qty: {it.quantity}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#6ee7b7', marginTop: 4 }}>
                          {Number(it.price * it.quantity || 0).toLocaleString()} EGP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Form */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.015)', padding: 20, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 14 }}>
                  UPDATE FULFILLMENT STATUS
                </h4>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>STATUS</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>CARRIER / COURIER</label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>TRACKING NUMBER</label>
                  <input
                    type="text"
                    placeholder="e.g. BOSTA-EG-998214"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    style={{ width: '100%', fontFamily: 'var(--font-mono)', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  />
                </div>

                <button
                  onClick={handleUpdateOrderStatus}
                  disabled={updatingOrder}
                  className="btn-luxury touch-target"
                  style={{ width: '100%', padding: '14px', fontSize: 11, borderRadius: 4, marginBottom: 10 }}
                >
                  {updatingOrder ? 'UPDATING REGISTRY...' : 'UPDATE ORDER STATUS'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.orderNumber)}
                  className="btn-luxury-outline touch-target"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: 11,
                    borderRadius: 4,
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                  title="Permanently remove order"
                >
                  <Trash2 size={13} />
                  <span>DELETE ORDER</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EMAIL PREVIEW MODAL                                   */}
      {/* ============================================================== */}
      {previewEmailHtml && (
        <div className="modal-backdrop" onClick={() => setPreviewEmailHtml(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 740, maxHeight: '92vh', padding: 0 }}
          >
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e0e12' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={16} />
                <h3 style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>
                  {previewEmailTitle}
                </h3>
              </div>
              <button onClick={() => setPreviewEmailHtml(null)} className="btn-icon touch-target" style={{ width: 34, height: 34 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '12px', background: '#000000', maxHeight: 'calc(92vh - 60px)', overflowY: 'auto' }}>
              <iframe
                srcDoc={previewEmailHtml}
                style={{ width: '100%', minHeight: '600px', border: 'none', borderRadius: 4, background: '#09090b' }}
                title="Email Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ADD PRODUCT MODAL (MOBILE RESPONSIVE)                 */}
      {/* ============================================================== */}
      {showAddProductModal && (
        <div className="modal-backdrop" onClick={() => setShowAddProductModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 680, maxHeight: '92vh', overflowY: 'auto', padding: 0 }}
          >
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e0e12', position: 'sticky', top: 0, zIndex: 10 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.12em', color: '#fff' }}>
                ADD LUXURY PIECE
              </h2>
              <button onClick={() => setShowAddProductModal(false)} className="btn-icon touch-target" style={{ width: 36, height: 36 }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PIECE NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sculpted Peacoat"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CATEGORY *</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  >
                    <option value="outerwear">Outerwear</option>
                    <option value="knitwear">Knitwear</option>
                    <option value="trousers">Trousers</option>
                    <option value="leather">Leather Goods</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>SUBTITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% Mongolian Cashmere"
                  value={newProductSubtitle}
                  onChange={(e) => setNewProductSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PRICE (EGP) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    style={{ width: '100%', fontFamily: 'var(--font-mono)', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>STOCK COUNT *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    style={{ width: '100%', fontFamily: 'var(--font-mono)', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  />
                </div>
              </div>

              {/* Image Input System */}
              <div style={{ marginBottom: 18, padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-medium)', borderRadius: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: '#fff', marginBottom: 8 }}>
                  <LinkIcon size={14} />
                  <span>IMAGE URL INPUT (HTTPS) *</span>
                </label>

                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    style={{ flexGrow: 1, padding: '10px 12px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', fontSize: 14, borderRadius: 4 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="btn-luxury-outline touch-target"
                    style={{ padding: '8px 14px', fontSize: 11, borderRadius: 4 }}
                  >
                    ADD
                  </button>
                </div>

                {productImagesList.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {productImagesList.map((imgSrc, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 54, height: 68, borderRadius: 4, overflow: 'hidden', border: '1px solid #fff' }}>
                        <img src={imgSrc} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => setProductImagesList(productImagesList.filter((_, i) => i !== idx))}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Size & Stock Management */}
              <div style={{ marginBottom: 18, padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-medium)', borderRadius: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: '#fff', marginBottom: 10 }}>
                  <Package size={14} />
                  <span>SIZE VARIANTS & STOCK</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>
                    Total: {productSizeStockList.reduce((s, x) => s + x.stock, 0)} units
                  </span>
                </label>

                {/* Existing size rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                  {productSizeStockList.map((ss, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#121216', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '6px 10px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#fff', minWidth: 70 }}>{ss.size}</span>
                      <input
                        type="number"
                        min="0"
                        value={ss.stock}
                        onChange={(e) => {
                          const updated = [...productSizeStockList];
                          updated[idx] = { ...updated[idx], stock: Math.max(0, Number(e.target.value)) };
                          setProductSizeStockList(updated);
                        }}
                        style={{ width: 70, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 13, textAlign: 'center' }}
                      />
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>units</span>
                      <button
                        type="button"
                        onClick={() => setProductSizeStockList(productSizeStockList.filter((_, i) => i !== idx))}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 15, lineHeight: 1 }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new size */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Size (e.g. 48 / M)"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    style={{ flexGrow: 1, padding: '8px 12px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', fontSize: 13, borderRadius: 4 }}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock"
                    value={newSizeStockInput}
                    onChange={(e) => setNewSizeStockInput(Math.max(0, Number(e.target.value)))}
                    style={{ width: 70, padding: '8px 10px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', fontFamily: 'var(--font-mono)', fontSize: 13, borderRadius: 4, textAlign: 'center' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSizeInput.trim()) return;
                      setProductSizeStockList((prev) => [...prev, { size: newSizeInput.trim(), stock: newSizeStockInput }]);
                      setNewSizeInput('');
                      setNewSizeStockInput(5);
                    }}
                    className="btn-luxury-outline touch-target"
                    style={{ padding: '7px 14px', fontSize: 11, borderRadius: 4 }}
                  >
                    ADD
                  </button>
                </div>
              </div>

              {/* Color System */}
              <div style={{ marginBottom: 18, padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-medium)', borderRadius: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: '#fff', marginBottom: 8 }}>
                  <Palette size={14} />
                  <span>COLOR VARIANTS</span>
                </label>

                <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Color Name (e.g. Obsidian Black)"
                    value={newColorNameInput}
                    onChange={(e) => setNewColorNameInput(e.target.value)}
                    style={{ flexGrow: 1, padding: '10px 12px', fontSize: 14, background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4 }}
                  />
                  <input
                    type="color"
                    value={newColorHexInput}
                    onChange={(e) => setNewColorHexInput(e.target.value)}
                    style={{ width: 44, height: 42, background: 'none', border: '1px solid var(--border-medium)', cursor: 'pointer', padding: 2, borderRadius: 4 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddColorOption}
                    className="btn-luxury-outline touch-target"
                    style={{ padding: '8px 14px', fontSize: 11, borderRadius: 4 }}
                  >
                    ADD
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {productColorsList.map((col, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: col.hex, border: '1px solid rgba(255,255,255,0.2)' }} />
                      <span>{col.name}</span>
                      <button
                        type="button"
                        onClick={() => setProductColorsList(productColorsList.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', marginLeft: 4, fontSize: 13 }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>MATERIALS & COMPOSITION</label>
                <input
                  type="text"
                  placeholder="e.g. 100% Virgin Cashmere"
                  value={newProductMaterials}
                  onChange={(e) => setNewProductMaterials(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  placeholder="Atelier garment description..."
                  style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                />
              </div>

              <button type="submit" className="btn-luxury touch-target" style={{ width: '100%', padding: '14px', fontSize: 12, borderRadius: 4 }}>
                PUBLISH TO ATELIER CATALOG
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: EDIT PRODUCT MODAL (MOBILE RESPONSIVE)                */}
      {/* ============================================================== */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 680, maxHeight: '92vh', overflowY: 'auto', padding: 0 }}
          >
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e0e12', position: 'sticky', top: 0, zIndex: 10 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.12em', color: '#fff' }}>
                EDIT PIECE // {editingProduct.name}
              </h2>
              <button onClick={() => setEditingProduct(null)} className="btn-icon touch-target" style={{ width: 36, height: 36 }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PIECE NAME *</label>
                  <input
                    type="text"
                    required
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CATEGORY *</label>
                  <select
                    value={editProductCategory}
                    onChange={(e) => setEditProductCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  >
                    <option value="outerwear">Outerwear</option>
                    <option value="knitwear">Knitwear</option>
                    <option value="trousers">Trousers</option>
                    <option value="leather">Leather Goods</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>SUBTITLE *</label>
                <input
                  type="text"
                  required
                  value={editProductSubtitle}
                  onChange={(e) => setEditProductSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PRICE (EGP) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(Number(e.target.value))}
                    style={{ width: '100%', fontFamily: 'var(--font-mono)', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>STOCK COUNT *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editProductStock}
                    onChange={(e) => setEditProductStock(Number(e.target.value))}
                    style={{ width: '100%', fontFamily: 'var(--font-mono)', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                  />
                </div>
              </div>

              {/* Edit Image URLs */}
              <div style={{ marginBottom: 18, padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-medium)', borderRadius: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: '#fff', marginBottom: 8 }}>
                  <LinkIcon size={14} />
                  <span>ADD IMAGE URL *</span>
                </label>

                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editImageUrlInput}
                    onChange={(e) => setEditImageUrlInput(e.target.value)}
                    style={{ flexGrow: 1, padding: '10px 12px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', fontSize: 14, borderRadius: 4 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddEditImageUrl}
                    className="btn-luxury-outline touch-target"
                    style={{ padding: '8px 14px', fontSize: 11, borderRadius: 4 }}
                  >
                    ADD
                  </button>
                </div>

                {editProductImagesList.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {editProductImagesList.map((imgSrc, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 54, height: 68, borderRadius: 4, overflow: 'hidden', border: '1px solid #fff' }}>
                        <img src={imgSrc} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => setEditProductImagesList(editProductImagesList.filter((_, i) => i !== idx))}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Size & Stock */}
              <div style={{ marginBottom: 18, padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-medium)', borderRadius: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: '#fff', marginBottom: 10 }}>
                  <Package size={14} />
                  <span>SIZE VARIANTS &amp; STOCK</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>
                    Total: {editSizeStockList.reduce((s, x) => s + x.stock, 0)} units
                  </span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                  {editSizeStockList.map((ss, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#121216', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '6px 10px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#fff', minWidth: 70 }}>{ss.size}</span>
                      <input
                        type="number" min="0" value={ss.stock}
                        onChange={(e) => { const updated = [...editSizeStockList]; updated[idx] = { ...updated[idx], stock: Math.max(0, Number(e.target.value)) }; setEditSizeStockList(updated); }}
                        style={{ width: 70, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 13, textAlign: 'center' }}
                      />
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>units</span>
                      <button type="button" onClick={() => setEditSizeStockList(editSizeStockList.filter((_, i) => i !== idx))} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 15 }}>&times;</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="text" placeholder="New size label" value={editNewSizeInput} onChange={(e) => setEditNewSizeInput(e.target.value)} style={{ flexGrow: 1, padding: '8px 12px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', fontSize: 13, borderRadius: 4 }} />
                  <input type="number" min="0" value={editNewSizeStockInput} onChange={(e) => setEditNewSizeStockInput(Math.max(0, Number(e.target.value)))} style={{ width: 70, padding: '8px 10px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', fontFamily: 'var(--font-mono)', fontSize: 13, borderRadius: 4, textAlign: 'center' }} />
                  <button type="button" onClick={() => { if (!editNewSizeInput.trim()) return; setEditSizeStockList((prev) => [...prev, { size: editNewSizeInput.trim(), stock: editNewSizeStockInput }]); setEditNewSizeInput(''); setEditNewSizeStockInput(5); }} className="btn-luxury-outline touch-target" style={{ padding: '7px 14px', fontSize: 11, borderRadius: 4 }}>ADD</button>
                </div>
              </div>

              {/* Edit Colors */}
              <div style={{ marginBottom: 18, padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-medium)', borderRadius: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: '#fff', marginBottom: 8 }}>
                  <Palette size={14} />
                  <span>COLOR OPTIONS</span>
                </label>

                <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Color Name (e.g. Navy)"
                    value={editColorNameInput}
                    onChange={(e) => setEditColorNameInput(e.target.value)}
                    style={{ flexGrow: 1, padding: '10px 12px', fontSize: 14, background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4 }}
                  />
                  <input
                    type="color"
                    value={editColorHexInput}
                    onChange={(e) => setEditColorHexInput(e.target.value)}
                    style={{ width: 44, height: 42, background: 'none', border: '1px solid var(--border-medium)', cursor: 'pointer', padding: 2, borderRadius: 4 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddEditColorOption}
                    className="btn-luxury-outline touch-target"
                    style={{ padding: '8px 14px', fontSize: 11, borderRadius: 4 }}
                  >
                    ADD
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {editProductColorsList.map((col, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: col.hex, border: '1px solid rgba(255,255,255,0.2)' }} />
                      <span>{col.name}</span>
                      <button
                        type="button"
                        onClick={() => setEditProductColorsList(editProductColorsList.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', marginLeft: 4, fontSize: 13 }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>MATERIALS & COMPOSITION</label>
                <input
                  type="text"
                  value={editProductMaterials}
                  onChange={(e) => setEditProductMaterials(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={editProductDescription}
                  onChange={(e) => setEditProductDescription(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', background: '#121216', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: 4, fontSize: 16 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn-luxury-outline touch-target"
                  style={{ width: '50%', padding: '14px', fontSize: 11, borderRadius: 4 }}
                >
                  CANCEL
                </button>
                <button type="submit" className="btn-luxury touch-target" style={{ width: '50%', padding: '14px', fontSize: 11, borderRadius: 4 }}>
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}