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
      <header className="header-glass" style={{ position: 'sticky', top: 0, zIndex: 40, width: '100%' }}>
        <div
          className="container header-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '64px',
            padding: '0 12px'
          }}
        >

          {/* Left Section: Menu Button + Brand Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon mobile-menu-btn"
              title="Toggle Menu"
              style={{ padding: '8px', flexShrink: 0 }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Brand Title */}
            <Link href="/" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', minWidth: 0, overflow: 'hidden' }}>
              <span className="brand-title" style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '0.15em',
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
                fontSize: '7px',
                letterSpacing: '0.25em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginTop: -2
              }}>
                HAUTE ATELIER
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: 32 }}>
            <a href="#collection" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              COLLECTION
            </a>
            {/* <a href="#atelier" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              ATELIER
            </a> */}
            <a href="#lookbook" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              LOOKBOOK
            </a>
            <button
              onClick={onOpenTracking}
              style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              TRACK SHIPMENT
            </button>
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>

            {/* Search Trigger */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="btn-icon"
              title="Search catalog"
              style={{ padding: '8px', background: showSearch ? 'var(--bg-elevated)' : 'transparent' }}
            >
              <Search size={17} />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="btn-icon"
              style={{ position: 'relative', padding: '8px' }}
              title="Wishlist"
            >
              <Heart size={17} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: 'var(--text-primary)',
                  color: 'var(--bg-deep)',
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  fontSize: 9,
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

            {/* Shopping Bag Icon */}
            <button
              onClick={onOpenCart}
              className="btn-icon"
              style={{ position: 'relative', padding: '8px' }}
              title="Shopping Bag"
            >
              <ShoppingBag size={17} />
              {cartTotalCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: 'var(--text-primary)',
                  color: 'var(--bg-deep)',
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  fontSize: 9,
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

        {/* Mobile / Expandable Search Bar Dropdown */}
        {showSearch && (
          <div style={{
            width: '100%',
            padding: '10px 16px',
            borderTop: '1px solid var(--border-medium)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none'
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
          <a
            href="#atelier"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.2em', color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            ATELIER CRAFT
          </a>
          <a
            href="#lookbook"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.2em', color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            RUNWAY LOOKBOOK
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
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .brand-title {
            font-size: 19px !important;
          }
          .brand-subtitle {
            font-size: 9px !important;
          }
        }
      `}</style>
    </>
  );
}