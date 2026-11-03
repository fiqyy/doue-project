'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';
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
      <header
        className="header-glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '100%',
            height: '72px',
            padding: '0 16px',
            boxSizing: 'border-box'
          }}
        >

          {/* Left Section: Mobile Menu Button + Brand Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flexShrink: 1 }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon mobile-menu-btn"
              title="Toggle Menu"
              style={{ flexShrink: 0 }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Brand Title */}
            <Link href="/" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', minWidth: 0, overflow: 'hidden' }}>
              <span className="brand-title" style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                DOUE Project
              </span>
              <span className="brand-subtitle" style={{
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.3em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginTop: -1
              }}>
                HAUTE ATELIER
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links (Properly spaced in the center/right) */}
          <nav className="desktop-nav" style={{ alignItems: 'center', gap: 36, margin: '0 auto' }}>
            <a href="#collection" className="nav-link">
              COLLECTION
            </a>
            <button
              onClick={onOpenTracking}
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              TRACK SHIPMENT
            </button>
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

            {/* Search Trigger */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="btn-icon"
              title="Search catalog"
              style={{ background: showSearch ? 'var(--bg-elevated)' : 'transparent', flexShrink: 0 }}
            >
              <Search size={18} />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="btn-icon"
              style={{ position: 'relative', flexShrink: 0 }}
              title="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="badge-count">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <button
              onClick={onOpenCart}
              className="btn-icon"
              style={{ position: 'relative', flexShrink: 0 }}
              title="Shopping Bag"
            >
              <ShoppingBag size={18} />
              {cartTotalCount > 0 && (
                <span className="badge-count">
                  {cartTotalCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Expandable Search Bar Dropdown */}
        {showSearch && (
          <div style={{
            width: '100%',
            padding: '12px 24px',
            borderTop: '1px solid var(--border-medium)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxSizing: 'border-box'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search high-end pieces..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                minWidth: 0
              }}
            />
            <button
              onClick={() => {
                setShowSearch(false);
                onSearchChange('');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </header>

      {/* Fullscreen Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(5, 5, 6, 0.96)',
            backdropFilter: 'blur(25px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 32,
            padding: 32
          }}
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="btn-icon"
            style={{ position: 'absolute', top: 20, right: 20 }}
          >
            <X size={26} />
          </button>

          <a
            href="#collection"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.2em', color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            COLLECTION
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracking();
            }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              letterSpacing: '0.2em',
              color: 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            TRACK SHIPMENT
          </button>
        </div>
      )}

      <style jsx>{`
        .desktop-nav {
          display: none;
        }
        .mobile-menu-btn {
          display: flex;
        }
        .brand-title {
          font-size: 13px;
        }
        .brand-subtitle {
          font-size: 7px;
        }
        .nav-link {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .badge-count {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--text-primary);
          color: var(--bg-deep);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 9px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
        }
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .brand-title {
            font-size: 18px !important;
          }
          .brand-subtitle {
            font-size: 8px !important;
          }
        }
      `}</style>
    </>
  );
}