'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Heart, Rotate3D, Plus, Check } from 'lucide-react';
import { Product } from '@/types';

interface ProductCard3DProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onOpen3D: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export default function ProductCard3D({
  product,
  onSelect,
  onAddToCart,
  onOpen3D,
  isWishlisted = false,
  onToggleWishlist
}: ProductCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareOpacity, setGlareOpacity] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [hoverSecondImage, setHoverSecondImage] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [addedNotice, setAddedNotice] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10; // Max 10 deg tilt
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
    setGlareOpacity(0.18);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlareOpacity(0);
    setHoverSecondImage(false);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, product.colors[0]?.name || 'Noir');
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1600);
  };

  const currentImage = hoverSecondImage && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      ref={cardRef}
      className="product-card"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
        cursor: 'pointer'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHoverSecondImage(true)}
      onClick={() => onSelect(product)}
    >
      {/* 3D Light Glare Effect Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 8,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 65%)`,
          transition: 'opacity 0.2s ease'
        }}
      />

      {/* Product Image Section */}
      <div className="product-image-container">
        {product.badge && (
          <div className="product-badge">
            {product.badge}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
          className="btn-icon"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 10,
            width: 36,
            height: 36,
            background: 'rgba(12, 12, 15, 0.75)',
            borderColor: isWishlisted ? 'var(--text-primary)' : 'var(--border-subtle)'
          }}
          title={isWishlisted ? 'Remove from Atelier Wishlist' : 'Add to Atelier Wishlist'}
        >
          <Heart
            size={16}
            fill={isWishlisted ? 'var(--text-primary)' : 'none'}
            color={isWishlisted ? 'var(--text-primary)' : 'var(--text-secondary)'}
          />
        </button>

        <Image
          src={currentImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          style={{ objectFit: 'cover' }}
        />

        {/* 3D Inspect Trigger Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen3D(product);
          }}
          style={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            zIndex: 7,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: 'rgba(12, 12, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-medium)',
            borderRadius: 20,
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em',
            color: 'var(--text-primary)'
          }}
          title="Inspect in 3D"
        >
          <Rotate3D size={13} />
          <span>3D VIEW</span>
        </button>

        {/* Quick Size Selection & Add to Cart on Hover */}
        <div className="product-quick-actions" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', gap: 6, flexGrow: 1, overflowX: 'auto' }}>
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                style={{
                  padding: '6px 10px',
                  background: selectedSize === s ? 'var(--text-primary)' : 'rgba(24, 24, 28, 0.85)',
                  color: selectedSize === s ? 'var(--bg-deep)' : 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 2,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              >
                {s.split('/')[0].trim()}
              </button>
            ))}
          </div>

          <button
            onClick={handleQuickAdd}
            className="btn-luxury"
            style={{
              padding: '8px 16px',
              fontSize: 11,
              whiteSpace: 'nowrap'
            }}
          >
            {addedNotice ? (
              <>
                <Check size={14} />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>ACQUIRE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="product-details">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-subtitle">{product.subtitle}</p>

        <div className="product-price-row">
          <span className="product-price">{product.price.toLocaleString()} EGP</span>
          {product.originalPrice && (
            <span className="product-original-price">{product.originalPrice.toLocaleString()} EGP</span>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {product.stockCount > 0 ? `${product.stockCount} LEFT` : 'WAITLIST'}
          </span>
        </div>
      </div>
    </div>
  );
}
