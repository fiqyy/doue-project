'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Shield, Search, Menu, X } from 'lucide-react';
import { CartItem } from '@/types';

interface HeaderProps {
  cart: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenWishlist: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdminLogin?: () => void;
}

export default function Header({
  cart,
  wishlistCount,
  onOpenCart,
  onOpenTracking,
  onOpenWishlist,
  searchQuery,
  onSearchChange,
  onOpenAdminLogin
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);

  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="header-glass">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

          {/* Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon"
              style={{ display: 'flex' }}
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Brand Title */}
            <Link href="/" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '0.25em',
                color: 'var(--text-primary)',
                textTransform: 'uppercase'
              }}>
                DOUE Project
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.35em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginTop: -2
              }}>
                HAUTE ATELIER
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: 32 }} className="desktop-nav">
            <a href="#collection" style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              COLLECTION
            </a>
            <a href="#atelier" style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              ATELIER
            </a>
            <a href="#lookbook" style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              LOOKBOOK
            </a>
            <button
              onClick={onOpenTracking}
              style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}
            >
              TRACK SHIPMENT
            </button>
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Search Input Toggle */}
            {showSearch ? (
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: 20, padding: '4px 12px', border: '1px solid var(--border-medium)' }}>
                <Search size={14} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search pieces..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  style={{ background: 'none', border: 'none', padding: '6px 8px', fontSize: 12, width: 140 }}
                />
                <button onClick={() => setShowSearch(false)} style={{ color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowSearch(true)} className="btn-icon" title="Search catalog">
                <Search size={17} />
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="btn-icon"
              style={{ position: 'relative' }}
              title="Wishlist"
            >
              <Heart size={17} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--text-primary)',
                  color: 'var(--bg-deep)',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="btn-icon"
              style={{ position: 'relative' }}
              title="Shopping Bag"
            >
              <ShoppingBag size={17} />
              {cartTotalCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--text-primary)',
                  color: 'var(--bg-deep)',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {cartTotalCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            background: 'rgba(5, 5, 6, 0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 28,
            padding: 32
          }}
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="btn-icon"
            style={{ position: 'absolute', top: 24, right: 24 }}
          >
            <X size={24} />
          </button>

          <a
            href="#collection"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.2em' }}
          >
            COLLECTION
          </a>
          <a
            href="#atelier"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.2em' }}
          >
            ATELIER CRAFT
          </a>
          <a
            href="#lookbook"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.2em' }}
          >
            RUNWAY LOOKBOOK
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracking();
            }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.2em', color: 'var(--text-secondary)' }}
          >
            TRACK SHIPMENT
          </button>

        </div>
      )}

      <style type='jsx'>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 600px) {
          .admin-btn-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
