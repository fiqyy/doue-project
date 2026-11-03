'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, Gift, Tag, Check, ShieldCheck } from 'lucide-react';
import { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onProceedToCheckout: (appliedDiscount: number, discountCode: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = 45;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const estimatedTax = taxableAmount * 0.08;
  const total = taxableAmount + shippingFee + estimatedTax;

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'DOUEVIP10') {
      setDiscountPercent(10);
      setAppliedPromo(code);
    } else if (code === 'ARCHIVE20') {
      setDiscountPercent(20);
      setAppliedPromo(code);
    } else {
      setPromoError('Invalid VIP key');
    }
  };

  const handleRemovePromo = () => {
    setDiscountPercent(0);
    setAppliedPromo('');
    setPromoCode('');
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>

        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.15em' }}>
              ATELIER CART ({items.reduce((c, i) => c + i.quantity, 0)})
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: 36, height: 36 }}>
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator
        <div style={{ padding: '16px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
            <span>
              {remainingForFreeShipping === 0
                ? '✨ COMPLIMENTARY WORLDWIDE COURIER UNLOCKED'
                : `Add ${remainingForFreeShipping.toLocaleString()} EGP for Complimentary Courier`}
            </span>
            <span>{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressToFreeShipping}%`,
                height: '100%',
                background: 'var(--text-primary)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div> */}

        {/* Cart Items List */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-secondary)', marginBottom: 8 }}>
                YOUR BAG IS EMPTY
              </div>
              <p style={{ fontSize: 13, marginBottom: 24 }}>Explore the Volume IV Noir collection to acquire iconic pieces.</p>
              <button onClick={onClose} className="btn-luxury" style={{ fontSize: 11 }}>
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  style={{
                    display: 'flex',
                    gap: 16,
                    paddingBottom: 20,
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', width: 80, height: 104, flexShrink: 0, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                  </div>

                  {/* Info */}
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.05em' }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.productId, item.size)}
                        style={{ color: 'var(--text-muted)', padding: 4 }}
                        title="Remove piece"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 8px 0' }}>
                      Size: {item.size} &bull; {item.color}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      {/* Quantity Stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-medium)', borderRadius: 2 }}>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.size, -1)}
                          style={{ padding: '4px 8px', color: 'var(--text-secondary)' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.size, 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-secondary)' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>
                        {(item.price * item.quantity).toLocaleString()} EGP
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 2, border: '1px solid var(--border-medium)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                      <Tag size={13} />
                      <span>{appliedPromo} ({discountPercent}% VIP Privilege)</span>
                    </div>
                    <button onClick={handleRemovePromo} style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'underline' }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="VIP Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{ flexGrow: 1, padding: '8px 12px', fontSize: 12 }}
                    />
                    <button onClick={handleApplyPromo} className="btn-luxury-outline" style={{ padding: '8px 16px', fontSize: 11 }}>
                      APPLY
                    </button>
                  </div>
                )}
                {promoError && (
                  <p style={{ color: '#fca5a5', fontSize: 11, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                    {promoError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Total */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{subtotal.toLocaleString()} EGP</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6ee7b7' }}>
                  <span>Privilege Discount ({appliedPromo})</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>-{discountAmount.toLocaleString()} EGP</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Insured Courier Delivery</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${shippingFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tax & Duties Fee</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(estimatedTax).toLocaleString()} EGP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, paddingTop: 10, borderTop: '1px solid var(--border-medium)' }}>
                <span>TOTAL ACQUISITION</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(total).toLocaleString()} EGP</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(discountAmount, appliedPromo)}
              className="btn-luxury"
              style={{ width: '100%', padding: '16px', fontSize: 12 }}
            >
              <span>PROCEED TO SECURE CHECKOUT</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              <ShieldCheck size={14} />
              <span>256-BIT ENCRYPTED ATELIER GATEWAY &bull; INSURED TRANSIT</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
