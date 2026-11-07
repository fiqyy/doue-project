'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Check, Shield, Feather, Sparkles, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0]?.name || 'Noir');
      setActiveImageIdx(0);
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isSoldOut = !product.inStock || product.stockCount <= 0;

  const handleAdd = () => {
    if (isSoldOut) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  const activeImage = product.images[activeImageIdx] || product.images[0];

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 0,
          position: 'relative',
          background: 'var(--bg-deep, #09090b)',
          borderRadius: '4px',
          border: '1px solid var(--border-medium)',
          boxSizing: 'border-box'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-icon"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 40,
            width: 38,
            height: 38,
            background: 'rgba(12,12,15,0.85)',
            border: '1px solid var(--border-medium)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} color="#fff" />
        </button>

        {/* Modal Main Grid */}
        <div className="modal-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', width: '100%', boxSizing: 'border-box' }}>

          {/* Left Column: Image Gallery & Thumbnails */}
          <div style={{ position: 'relative', background: '#09090b', width: '100%', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>

            <div style={{ position: 'relative', width: '100%', flexGrow: 1, minHeight: '420px', background: 'var(--bg-elevated)' }}>
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, padding: 14, background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)', overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    style={{
                      position: 'relative',
                      width: 54,
                      height: 72,
                      borderRadius: 2,
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: activeImageIdx === i ? '2px solid #ffffff' : '1px solid var(--border-subtle)',
                      opacity: activeImageIdx === i ? 1 : 0.6,
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <Image src={img} alt={`Thumbnail ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Couture Specs & Purchasing */}
          <div style={{ padding: '24px 20px 32px 20px', display: 'flex', flexDirection: 'column', background: 'var(--bg-deep)', width: '100%', boxSizing: 'border-box' }}>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.25em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              {product.category}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.08em', marginBottom: 6, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
              {product.name}
            </h1>

            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {product.subtitle}
            </div>

            {/* Price & Stock Status Pill */}
            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
                {product.price.toLocaleString()} EGP
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: isSoldOut ? '#fca5a5' : '#6ee7b7' }}>
                {isSoldOut ? 'OUT OF STOCK' : 'IN STOCK'}
              </span>
            </div>

            {/* Egyptian Market Trust Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 2, marginBottom: 20, fontSize: 11, color: '#d4d4d8', boxSizing: 'border-box' }}>
              <Check size={14} color="#6ee7b7" style={{ flexShrink: 0 }} />
              <span>Try & Inspect on Delivery (معاينة عند الاستلام) &bull; Cairo Dispatch</span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, wordBreak: 'break-word' }}>
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>SHADE</span>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedColor}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.colors.map((c, index) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (product.images[index]) {
                          setActiveImageIdx(index);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 12px',
                        borderRadius: 2,
                        background: selectedColor === c.name ? 'var(--bg-elevated)' : 'var(--bg-card)',
                        border: selectedColor === c.name ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.hex, border: '1px solid rgba(255,255,255,0.2)' }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>ATELIER SIZING</span>
                <span style={{ color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer' }}>
                  {product.modelDetails || 'View Fit Guide'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: '8px 16px',
                      background: selectedSize === s ? 'var(--text-primary)' : 'var(--bg-card)',
                      color: selectedSize === s ? 'var(--bg-deep)' : 'var(--text-primary)',
                      border: selectedSize === s ? '1px solid #ffffff' : '1px solid var(--border-medium)',
                      borderRadius: 2,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Bag */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-medium)', borderRadius: 2, background: 'var(--bg-card)' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '12px 14px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 10px', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount || 10, q + 1))}
                  style={{ padding: '12px 14px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                disabled={isSoldOut}
                onClick={handleAdd}
                className="btn-luxury"
                style={{
                  flexGrow: 1,
                  minWidth: '180px',
                  padding: '14px 16px',
                  fontSize: 11,
                  boxSizing: 'border-box',
                  opacity: isSoldOut ? 0.4 : 1,
                  cursor: isSoldOut ? 'not-allowed' : 'pointer',
                  background: isSoldOut ? 'var(--bg-card)' : undefined,
                  color: isSoldOut ? 'var(--text-muted)' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                {isSoldOut ? (
                  <span>SOLD OUT</span>
                ) : addedNotice ? (
                  <>
                    <Check size={16} />
                    <span>ACQUISITION ADDED</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>ADD TO BAG &bull; {(product.price * quantity).toLocaleString()} EGP</span>
                  </>
                )}
              </button>
            </div>

            {/* Craftsmanship Details Accordion */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: 18, fontSize: 12, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, color: '#fff', fontWeight: 600 }}>
                <Feather size={14} />
                <span>MATERIALS & ARTISANAL CRAFT</span>
              </div>
              <p style={{ marginBottom: 12, wordBreak: 'break-word' }}>{product.materials}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, color: '#fff', fontWeight: 600 }}>
                <Shield size={14} />
                <span>PROVENANCE & CARE</span>
              </div>
              <p style={{ wordBreak: 'break-word' }}>{product.care}</p>
            </div>

          </div>

        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .modal-grid-layout {
            grid-template-columns: 1.1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}