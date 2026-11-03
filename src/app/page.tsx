'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Rotate3D,
  Play,
  Pause,
  ChevronDown,
  Volume2,
  VolumeX,
  Compass,
  Check,
  Heart,
  SlidersHorizontal,
  X,
  Lock
} from 'lucide-react';
import Header from '@/components/Header';
import ProductCard3D from '@/components/ProductCard3D';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderTrackingModal from '@/components/OrderTrackingModal';
import { Product, CartItem, Order } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalInitial3D, setProductModalInitial3D] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');

  // Checkout discount & gift packaging
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('');
  const [giftPackaging, setGiftPackaging] = useState(true);

  // Video & Ambient
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Hidden Admin Access via Password (aro2026)
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);

  useEffect(() => {
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey: Ctrl+Shift+A or Alt+A opens Admin Auth Passkey prompt
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminAuthModalOpen(true);
        return;
      }

      // Typing "admin" anywhere on the homepage triggers the passkey prompt
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 5) keyBuffer = keyBuffer.slice(-5);
      if (keyBuffer === 'admin') {
        setIsAdminAuthModalOpen(true);
        keyBuffer = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError('');
    setAdminAuthLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPasswordInput })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid password');
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('doue_admin_authenticated', 'true');
        window.location.href = '/admin';
      }
    } catch (err: any) {
      setAdminAuthError(err.message || 'Access restricted. Invalid passkey.');
    } finally {
      setAdminAuthLoading(false);
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    try {
      const savedCart = localStorage.getItem('doue_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem('doue_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) { }
  }, []);

  // Save cart to local storage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('doue_cart', JSON.stringify(newCart));
    } catch (e) { }
  };

  // Cart actions
  const handleAddToCart = (product: Product, size: string, color: string, quantity: number = 1) => {
    const existingIdx = cart.findIndex((i) => i.productId === product.id && i.size === size);
    let updatedCart: CartItem[];

    if (existingIdx >= 0) {
      updatedCart = [...cart];
      updatedCart[existingIdx].quantity += quantity;
    } else {
      updatedCart = [
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size,
          color,
          quantity
        }
      ];
    }

    saveCart(updatedCart);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, size: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.productId === productId && item.size === size) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    saveCart(updated);
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    const updated = cart.filter((i) => !(i.productId === productId && i.size === size));
    saveCart(updated);
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product) => {
    let nextWishlist: string[];
    if (wishlist.includes(product.id)) {
      nextWishlist = wishlist.filter((id) => id !== product.id);
    } else {
      nextWishlist = [...wishlist, product.id];
    }
    setWishlist(nextWishlist);
    try {
      localStorage.setItem('doue_wishlist', JSON.stringify(nextWishlist));
    } catch (e) { }
  };

  // Open product in modal
  const handleOpenProduct = (product: Product, initial3D: boolean = false) => {
    setSelectedProduct(product);
    setProductModalInitial3D(initial3D);
    setIsProductModalOpen(true);
  };

  // Filter & Sort
  const filteredProducts = products
    .filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.materials.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const categories = [
    { id: 'all', label: 'All Pieces' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'knitwear', label: 'Knitwear' },
    { id: 'trousers', label: 'Trousers' },
    { id: 'leather', label: 'Leather Goods' }
  ];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-deep)', position: 'relative' }}>

      {/* 1. Global Navigation Header */}
      <Header
        cart={cart}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdminLogin={() => setIsAdminAuthModalOpen(true)}
      />

      {/* 2. Hero Section with Looping Muted Background Video */}
      <section className="hero-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Ambient video background loop */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-bg-video"
          src="https://res.cloudinary.com/le4531f6/video/upload/v1793669023/23324-334689157_medium.mp4"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="hero-gradient-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 6, 0.75)', zIndex: 2 }} />

        {/* Hero Content Overlay */}
        <div className="hero-content" style={{ position: 'relative', zIndex: 3 }}>
          <div className="hero-subtitle">
            <span>VOLUME IV // RUNWAY 2026</span>
          </div>

          <h1 className="hero-title">
            DOUE PROJECT
          </h1>

          <p className="hero-desc">
            Aesthetic elegance forged in deep obsidian and slate grey. Crafted in Biella from double-faced cashmere, deconstructed floating canvases, and hand-finished titanium hardware.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#collection" className="btn-luxury">
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Floating Luxury Specifications */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            marginTop: 48,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}>
            <div>&bull; Double-Faced Virgin Cashmere</div>
            <div>&bull; Limited 1 of 50 Series</div>
            <div>&bull; Insured Courier</div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 3, color: 'var(--text-muted)' }}>
          <ChevronDown size={22} className="animate-bounce" />
        </div>
      </section>

      {/* 3. Main Collection Showcase */}
      <section id="collection" style={{ padding: '80px 0 100px 0' }}>
        <div className="container">

          {/* Section Heading */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.25em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                CURATED SILHOUETTES
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginTop: 4 }}>
                THE MONOCHROME VAULT
              </h2>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{ background: 'var(--bg-card)', padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-mono)' }}
              >
                <option value="featured">Featured Runway</option>
                <option value="price-asc">Price: Ascending</option>
                <option value="price-desc">Price: Descending</option>
              </select>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, marginBottom: 40 }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  background: selectedCategory === cat.id ? 'var(--text-primary)' : 'var(--bg-card)',
                  color: selectedCategory === cat.id ? 'var(--bg-deep)' : 'var(--text-secondary)',
                  border: selectedCategory === cat.id ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                  fontWeight: selectedCategory === cat.id ? 600 : 400
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  margin: '0 auto 20px auto',
                  animation: 'spin 0.8s linear infinite'
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                LOADING ATELIER PIECES...
              </span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', marginBottom: 8 }}>
                NO PIECES FOUND
              </h3>
              <p style={{ fontSize: 13, marginBottom: 20 }}>Try resetting your category or search filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="btn-luxury"
                style={{ fontSize: 11 }}
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: 28
            }}>
              {filteredProducts.map((product) => (
                <ProductCard3D
                  key={product.id}
                  product={product}
                  onSelect={(p) => handleOpenProduct(p, false)}
                  onAddToCart={(p, s, c) => handleAddToCart(p, s, c, 1)}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. Private Salon Allocation Subscription */}
      <section style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 580 }}>
          <Sparkles size={24} color="#ffffff" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: 24, letterSpacing: '0.12em', marginBottom: 12 }}>
            JOIN THE DOUE INNER CIRCLE
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
            Receive updates, new arrivals, and exclusive access.
          </p>

          {newsletterSubscribed ? (
            <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid #ffffff', borderRadius: 2, color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              ✨ WELCOME TO THE PRIVATE ATELIER CIRCLE.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) setNewsletterSubscribed(true);
              }}
              style={{ display: 'flex', gap: 10 }}
            >
              <input
                type="email"
                required
                placeholder="Enter your VIP email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{ flexGrow: 1, padding: '14px 18px', fontSize: 13 }}
              />
              <button type="submit" className="btn-luxury" style={{ padding: '14px 28px', fontSize: 11 }}>
                JOIN CIRCLE
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 5. Luxury Haute Atelier Footer */}
      <footer style={{ background: '#050506', borderTop: '1px solid var(--border-subtle)', padding: '60px 0 40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 50 }}>

            {/* Brand Col */}
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.2em', fontWeight: 600, color: '#fff' }}>
                DOUE
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', color: 'var(--text-muted)', margin: '4px 0 16px 0' }}>
                HAUTE ATELIER DECONSTRUCTION
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Architectural silhouettes tailored in Egypt. Pure obsidian black and slate grey aesthetics.
              </p>
            </div>

            {/* Navigation Col */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: '#fff', marginBottom: 14 }}>
                COLLECTION
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <li><a href="#collection" onClick={() => setSelectedCategory('outerwear')}>Outerwear</a></li>
                <li><a href="#collection" onClick={() => setSelectedCategory('knitwear')}>Knitwear</a></li>
                <li><a href="#collection" onClick={() => setSelectedCategory('leather')}>Leather</a></li>
              </ul>
            </div>

            {/* Client Concierge Col */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: '#fff', marginBottom: 14 }}>
                CLIENT CONCIERGE
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <li>
                  <button onClick={() => setIsTrackingOpen(true)} style={{ color: 'inherit', fontSize: 'inherit', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Track Insured Shipment
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 24, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            <div
              onClick={() => setIsAdminAuthModalOpen(true)}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              title="Atelier Director Key"
            >
              &copy; 2026 DOUE NOIR ATELIER. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>

      {/* 6. Interactive Modals & Slide-out Drawers */}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={(discount, code) => {
          setAppliedDiscount(discount);
          setAppliedDiscountCode(code);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discount={appliedDiscount}
        discountCode={appliedDiscountCode}
        giftPackaging={giftPackaging}
        onOrderSuccess={(confirmedOrder) => {
          saveCart([]);
          setTrackingOrderNumber(confirmedOrder.orderNumber);
        }}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderNumber={trackingOrderNumber}
      />

      {/* Wishlist Slideover / Modal */}
      {isWishlistOpen && (
        <div className="drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
          <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.15em' }}>
                ATELIER WISHLIST ({wishlist.length})
              </h2>
              <button onClick={() => setIsWishlistOpen(false)} className="btn-icon" style={{ width: 36, height: 36 }}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <Heart size={32} style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#fff', marginBottom: 6 }}>
                    NO SAVED PIECES
                  </div>
                  <p style={{ fontSize: 12 }}>Save iconic garments to your private atelier collection.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {products
                    .filter((p) => wishlist.includes(p.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setIsWishlistOpen(false);
                          handleOpenProduct(item, false);
                        }}
                        style={{ display: 'flex', gap: 14, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      >
                        <div style={{ position: 'relative', width: 70, height: 90, flexShrink: 0, borderRadius: 2, overflow: 'hidden' }}>
                          <Image src={item.images[0]} alt={item.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#fff' }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 8px 0' }}>{item.subtitle}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>
                            {item.price.toLocaleString()} EGP
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Hidden Admin Passkey Authentication Modal */}
      {isAdminAuthModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAdminAuthModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 440, padding: '36px 32px', textAlign: 'center' }}
          >
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Lock size={22} color="#ffffff" />
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              ATELIER DIRECTOR AUTHENTICATION
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.12em', color: '#fff', margin: '6px 0 10px 0' }}>
              RESTRICTED ADMINISTRATIVE VAULT
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
              Enter administrative passkey to access operational dashboard, order fulfillments, and notification dispatch logs.
            </p>

            <form onSubmit={handleAdminAuthSubmit}>
              <div style={{ marginBottom: 14 }}>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter passkey (aro2026)"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', fontSize: 14, textAlign: 'center', letterSpacing: '0.2em' }}
                />
              </div>

              {adminAuthError && (
                <div style={{ color: '#fca5a5', fontSize: 11, marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
                  {adminAuthError}
                </div>
              )}

              <button
                type="submit"
                disabled={adminAuthLoading}
                className="btn-luxury"
                style={{ width: '100%', padding: '13px', fontSize: 11, marginBottom: 12 }}
              >
                {adminAuthLoading ? 'VERIFYING...' : 'UNLOCK & ENTER PORTAL'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAdminAuthModalOpen(false);
                  setAdminPasswordInput('');
                  setAdminAuthError('');
                }}
                style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}