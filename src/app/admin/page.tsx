'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Lock
} from 'lucide-react';
import { Order, Product, AdminStats, EmailNotification, AdminSettings, OrderStatus } from '@/types';

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'orders' | 'emails' | 'products' | 'settings'>('orders');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);

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

  // Add Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductSubtitle, setNewProductSubtitle] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Product['category']>('outerwear');
  const [newProductPrice, setNewProductPrice] = useState(1200);
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductMaterials, setNewProductMaterials] = useState('');
  const [newProductImages, setNewProductImages] = useState('https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85');
  const [newProductStock, setNewProductStock] = useState(10);

  // Settings form
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [storeNameInput, setStoreNameInput] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Fetch all admin data
  const fetchData = async () => {
    try {
      setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

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

  // Update order status
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
        // Refresh orders & stats
        fetchData();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setUpdatingOrder(false);
    }
  };

  // Resend notification
  const handleResendNotification = async (orderId: string) => {
    try {
      const res = await fetch('/api/admin/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'resend' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Notification email successfully resent!');
        fetchData();
      }
    } catch (err) {
      alert('Failed to resend notification');
    }
  };

  // Preview Email
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

  // Save Settings
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
        setSettingsSuccess('Notification settings successfully updated!');
        setTimeout(() => setSettingsSuccess(''), 3000);
      }
    } catch (err) {
      alert('Error saving settings');
    }
  };

  // Save New Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
          images: [newProductImages.trim()],
          sizes: ['46 / S', '48 / M', '50 / L', '52 / XL'],
          colors: [{ name: 'Obsidian Black', hex: '#0a0a0a' }],
          stockCount: Number(newProductStock),
          inStock: Number(newProductStock) > 0,
          badge: 'NEW ATELIER RELEASE'
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddProductModal(false);
        setNewProductName('');
        setNewProductSubtitle('');
        fetchData();
      }
    } catch (err) {
      alert('Failed to create product');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this piece from the catalog?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // Filter orders
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

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#070709', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
        <div style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 4,
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.85)',
          textAlign: 'center'
        }}>
          <div style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <Lock size={24} color="#ffffff" />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            ATELIER VAULT RESTRICTED
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.12em', color: '#fff', margin: '6px 0 12px 0' }}>
            ADMINISTRATIVE ACCESS
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
            Please authenticate with the atelier passkey to access operational order fulfillment, live email notifications, and inventory.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter passkey (aro2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', fontSize: 14, textAlign: 'center', letterSpacing: '0.2em' }}
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
              className="btn-luxury"
              style={{ width: '100%', padding: '14px', fontSize: 12, marginBottom: 14 }}
            >
              {authenticating ? 'AUTHENTICATING...' : 'UNLOCK ATELIER VAULT'}
            </button>

            <Link
              href="/"
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

  return (
    <div style={{ minHeight: '100vh', background: '#070709', color: '#fcfcfd' }}>

      {/* Top Admin Header */}
      <header style={{
        background: 'rgba(14, 14, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link
            href="/"
            className="btn-icon"
            style={{ width: 36, height: 36 }}
            title="Return to Main Boutique Storefront"
          >
            <ArrowLeft size={16} />
          </Link>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Shield size={18} color="#ffffff" />
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.15em', fontWeight: 600 }}>
                DOUE &bull; ATELIER ADMIN PORTAL
              </h1>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span>EMAIL NOTIFICATIONS SYSTEM ONLINE &bull; ORDER DISPATCH ACTIVE</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="btn-luxury-outline"
            style={{ padding: '8px 16px', fontSize: 11, gap: 6 }}
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>REFRESH DATA</span>
          </button>

          <Link href="/" className="btn-luxury" style={{ padding: '8px 18px', fontSize: 11 }}>
            <ShoppingBag size={13} />
            <span>VIEW BOUTIQUE</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn-luxury-outline"
            style={{ padding: '8px 14px', fontSize: 11, gap: 6, borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
            title="Lock Admin Vault and Logout"
          >
            <Lock size={13} />
            <span>LOCK VAULT</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="container" style={{ padding: '32px 24px' }}>

        {/* Top KPI Metric Cards */}
        {stats && (
          <div className="admin-grid">
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>TOTAL ATELIER REVENUE</span>
                <DollarSign size={16} color="#ffffff" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: '#ffffff', margin: '8px 0 4px 0' }}>
                {stats.totalRevenue.toLocaleString()} EGP
              </div>
              <div style={{ fontSize: 11, color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>
                Avg Acquisition Value: {stats.averageOrderValue.toLocaleString()} EGP
              </div>
            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>TOTAL ACQUISITIONS</span>
                <ShoppingBag size={16} color="#ffffff" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: '#ffffff', margin: '8px 0 4px 0' }}>
                {stats.totalOrders}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {stats.pendingOrders} Pending &bull; {stats.processingOrders} Processing
              </div>
            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>IN TRANSIT / SHIPPED</span>
                <Truck size={16} color="#a855f7" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: '#d8b4fe', margin: '8px 0 4px 0' }}>
                {stats.shippedOrders}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {stats.deliveredOrders} Delivered Worldwide
              </div>
            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>ADMIN NOTIFICATION EMAIL</span>
                <Mail size={16} color="#ffffff" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: '#ffffff', margin: '12px 0 4px 0', wordBreak: 'break-all' }}>
                {settings?.adminEmail || 'fiqyyyy@gmail.com'}
              </div>
              <div style={{ fontSize: 11, color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>
                {emails.length} Order Alerts Dispatched
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border-medium)', marginBottom: 28 }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'orders' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'orders' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.1em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <ShoppingBag size={14} />
            <span>ORDERS & DETAILS ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'emails' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'emails' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.1em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Mail size={14} />
            <span>EMAIL DISPATCH LOGS ({emails.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'products' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'products' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.1em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Package size={14} />
            <span>PRODUCT CATALOG ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'settings' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'settings' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.1em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Sliders size={14} />
            <span>NOTIFICATION SETTINGS</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & DETAILS */}
        {activeTab === 'orders' && (
          <div>
            {/* Filters Bar */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 12, flexGrow: 1, maxWidth: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 2, padding: '0 12px', flexGrow: 1 }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search order #, customer, email..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    style={{ background: 'none', border: 'none', width: '100%', fontSize: 13 }}
                  />
                </div>
              </div>

              {/* Status Filter Pills */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['all', 'pending', 'processing', 'shipped', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: statusFilter === st ? 'var(--text-primary)' : 'var(--bg-card)',
                      color: statusFilter === st ? 'var(--bg-deep)' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 4, overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ORDER REF</th>
                    <th>DATE & TIME</th>
                    <th>CLIENT</th>
                    <th>PIECES</th>
                    <th>TOTAL</th>
                    <th>ORDER STATUS</th>
                    <th>EMAIL ALERT</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No orders match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
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
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{order.customer.firstName} {order.customer.lastName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{order.customer.email}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {order.items.slice(0, 3).map((item, i) => (
                              <div key={i} style={{ position: 'relative', width: 28, height: 36, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                                <Image src={item.image} alt="piece" fill style={{ objectFit: 'cover' }} />
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
                          {order.total.toLocaleString()} EGP
                        </td>
                        <td>
                          <span className={`status-pill ${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 8px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: 12,
                            color: '#6ee7b7',
                            fontSize: 10,
                            fontFamily: 'var(--font-mono)'
                          }}>
                            <CheckCircle2 size={11} />
                            <span>NOTIFIED</span>
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
                              className="btn-luxury-outline"
                              style={{ padding: '6px 12px', fontSize: 10 }}
                            >
                              MANAGE
                            </button>
                            <button
                              onClick={() => handlePreviewEmail(order.id, 'admin')}
                              className="btn-icon"
                              style={{ width: 28, height: 28 }}
                              title="Preview Email Sent to Admin"
                            >
                              <Eye size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL DISPATCH LOGS */}
        {activeTab === 'emails' && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 4, padding: '20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em' }}>
                  REAL-TIME ORDER NOTIFICATION DISPATCHER
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Every acquisition automatically triggers responsive HTML emails to the store director (<span style={{ color: '#fff' }}>{settings?.adminEmail}</span>) and customer.
                </p>
              </div>

              {orders.length > 0 && (
                <button
                  onClick={() => handleResendNotification(orders[0].id)}
                  className="btn-luxury"
                  style={{ padding: '10px 20px', fontSize: 11 }}
                >
                  <Send size={13} />
                  <span>DISPATCH TEST ALERT</span>
                </button>
              )}
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 4, overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>TIME DISPATCHED</th>
                    <th>ORDER NUMBER</th>
                    <th>RECIPIENT EMAIL</th>
                    <th>TYPE</th>
                    <th>SUBJECT LINE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No email notifications logged yet. Place an order on the storefront to trigger instant dispatch!
                      </td>
                    </tr>
                  ) : (
                    emails.map((em) => (
                      <tr key={em.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                          {new Date(em.sentAt).toLocaleDateString()} {new Date(em.sentAt).toLocaleTimeString()}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
                          {em.orderNumber}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#fff' }}>
                          {em.recipientEmail}
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            background: em.type === 'admin_new_order' ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.1)',
                            borderRadius: 4,
                            fontSize: 10,
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase'
                          }}>
                            {em.type === 'admin_new_order' ? 'ADMIN ALERT' : 'CUSTOMER RECEIPT'}
                          </span>
                        </td>
                        <td style={{ fontSize: 12 }}>
                          {em.subject}
                        </td>
                        <td>
                          <span style={{ color: '#6ee7b7', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                            &bull; DELIVERED / ACTIVE
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              if (em.contentHtml) {
                                setPreviewEmailHtml(em.contentHtml);
                                setPreviewEmailTitle(`Email Notification Log (${em.subject})`);
                              } else {
                                handlePreviewEmail(em.orderId, em.type === 'admin_new_order' ? 'admin' : 'customer');
                              }
                            }}
                            className="btn-luxury-outline"
                            style={{ padding: '6px 12px', fontSize: 10 }}
                          >
                            <Eye size={12} />
                            <span>PREVIEW HTML</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT CATALOG */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.1em' }}>
                  ATELIER CATALOG MANAGEMENT ({products.length} PIECES)
                </h3>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Manage luxury garments, pricing, stock allocation, and 3D specifications
                </span>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="btn-luxury"
                style={{ padding: '10px 20px', fontSize: 11 }}
              >
                <Plus size={14} />
                <span>ADD NEW LUXURY PIECE</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {products.map((prod) => (
                <div key={prod.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', width: '100%', height: 260 }}>
                    <Image src={prod.images[0]} alt={prod.name} fill style={{ objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: 2, fontSize: 10, fontFamily: 'var(--font-mono)' }}>
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
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>
                      {prod.subtitle}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700 }}>
                        {prod.price.toLocaleString()} EGP
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="btn-icon"
                        style={{ width: 32, height: 32, color: '#fca5a5' }}
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 4, padding: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.12em', marginBottom: 6 }}>
                ADMIN EMAIL NOTIFICATION CONFIGURATION
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                Configure the destination email where real-time luxury order alerts are dispatched as soon as a customer acquires pieces on the website.
              </p>

              <form onSubmit={handleSaveSettings}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6 }}>
                    ADMIN RECIPIENT EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    style={{ width: '100%', fontSize: 14 }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, display: 'block' }}>
                    All high-value order alerts will be delivered to this address.
                  </span>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6 }}>
                    ATELIER BRAND / STORE NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={storeNameInput}
                    onChange={(e) => setStoreNameInput(e.target.value)}
                    style={{ width: '100%', fontSize: 14 }}
                  />
                </div>

                {settingsSuccess && (
                  <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#6ee7b7', borderRadius: 4, fontSize: 12, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
                    {settingsSuccess}
                  </div>
                )}

                <button type="submit" className="btn-luxury" style={{ padding: '12px 28px', fontSize: 11 }}>
                  SAVE NOTIFICATION SETTINGS
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: ORDER DETAIL & FULFILLMENT DRAWER */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 840, padding: 0 }}
          >
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
                  ACQUISITION MANAGEMENT & FULFILLMENT
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.12em', marginTop: 2 }}>
                  ORDER #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-icon" style={{ width: 36, height: 36 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>

              {/* Left Column: Items & Customer info */}
              <div>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 12 }}>
                  CLIENT & SHIPPING DESTINATION
                </h4>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 16, marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                    {selectedOrder.customer.email} &bull; {selectedOrder.customer.phone || 'No phone'}<br />
                    {selectedOrder.shippingAddress.address} {selectedOrder.shippingAddress.apartment}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                  </div>
                  {selectedOrder.giftPackaging && (
                    <div style={{ marginTop: 10, fontSize: 11, color: '#6ee7b7' }}>
                      🎁 Complimentary Atelier Gift Packaging Included
                    </div>
                  )}
                </div>

                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 12 }}>
                  ITEMS ORDERED ({selectedOrder.items.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, padding: 10, background: 'var(--bg-card)', borderRadius: 2 }}>
                      <div style={{ position: 'relative', width: 44, height: 56, flexShrink: 0, borderRadius: 2, overflow: 'hidden' }}>
                        <Image src={it.image} alt={it.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{it.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          Size: {it.size} &bull; Color: {it.color} &bull; Qty: {it.quantity}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
                        {(it.price * it.quantity).toLocaleString()} EGP
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                  <span>TOTAL PAID</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedOrder.total.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Right Column: Status & Logistics Management */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.015)', padding: 24, borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 16 }}>
                  UPDATE ORDER FULFILLMENT STATUS
                </h4>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>STATUS</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    style={{ width: '100%', padding: '10px 14px' }}
                  >
                    <option value="pending">Pending (Awaiting Atelier Allocation)</option>
                    <option value="processing">Processing (In Atelier Tailoring & QC)</option>
                    <option value="shipped">Shipped (In Insured Transit)</option>
                    <option value="delivered">Delivered (Completed)</option>
                    <option value="cancelled">Cancelled (Void)</option>
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>CARRIER</label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>TRACKING WAYBILL NUMBER</label>
                  <input
                    type="text"
                    placeholder="e.g. DHL-EX-8492019US"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <button
                  onClick={handleUpdateOrderStatus}
                  disabled={updatingOrder}
                  className="btn-luxury"
                  style={{ width: '100%', padding: '12px', fontSize: 11, marginBottom: 16 }}
                >
                  {updatingOrder ? 'UPDATING REGISTRY...' : 'UPDATE ORDER STATUS'}
                </button>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => handlePreviewEmail(selectedOrder.id, 'admin')}
                    className="btn-luxury-outline"
                    style={{ width: '100%', padding: '10px', fontSize: 11 }}
                  >
                    <Eye size={13} />
                    <span>VIEW ADMIN EMAIL ALERT HTML</span>
                  </button>

                  <button
                    onClick={() => handleResendNotification(selectedOrder.id)}
                    className="btn-luxury-outline"
                    style={{ width: '100%', padding: '10px', fontSize: 11 }}
                  >
                    <Send size={13} />
                    <span>RESEND NOTIFICATION EMAILS</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RENDERED EMAIL PREVIEW */}
      {previewEmailHtml && (
        <div className="modal-backdrop" onClick={() => setPreviewEmailHtml(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 740, maxHeight: '92vh', padding: 0 }}
          >
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e0e12' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={16} />
                <h3 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {previewEmailTitle}
                </h3>
              </div>
              <button onClick={() => setPreviewEmailHtml(null)} className="btn-icon" style={{ width: 32, height: 32 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '16px', background: '#000000', maxHeight: 'calc(92vh - 70px)', overflowY: 'auto' }}>
              <iframe
                srcDoc={previewEmailHtml}
                style={{
                  width: '100%',
                  minHeight: '700px',
                  border: 'none',
                  borderRadius: 4,
                  background: '#09090b'
                }}
                title="Email Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="modal-backdrop" onClick={() => setShowAddProductModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 640, padding: 0 }}
          >
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.12em' }}>
                ADD LUXURY PIECE TO ATELIER CATALOG
              </h2>
              <button onClick={() => setShowAddProductModal(false)} className="btn-icon" style={{ width: 36, height: 36 }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ padding: '28px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PIECE NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sculpted Double-Breasted Peacoat"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CATEGORY *</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="outerwear">Outerwear</option>
                    <option value="tailoring">Tailoring</option>
                    <option value="knitwear">Knitwear</option>
                    <option value="trousers">Trousers</option>
                    <option value="footwear">Footwear</option>
                    <option value="leather">Leather Goods</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>SUBTITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% Loro Piana Double-Faced Cashmere / Noir"
                  value={newProductSubtitle}
                  onChange={(e) => setNewProductSubtitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PRICE (USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>INITIAL STOCK ALLOCATION *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>EDITORIAL IMAGE URL *</label>
                <input
                  type="url"
                  required
                  value={newProductImages}
                  onChange={(e) => setNewProductImages(e.target.value)}
                  style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>MATERIALS & COMPOSITION</label>
                <input
                  type="text"
                  placeholder="e.g. 100% Virgin Cashmere (700gsm); Cupro lining"
                  value={newProductMaterials}
                  onChange={(e) => setNewProductMaterials(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  placeholder="Artisanal garment description..."
                  style={{ width: '100%' }}
                />
              </div>

              <button type="submit" className="btn-luxury" style={{ width: '100%', padding: '14px', fontSize: 12 }}>
                PUBLISH TO ATELIER CATALOG
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
