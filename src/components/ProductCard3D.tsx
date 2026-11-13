'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoverSecondImage, setHoverSecondImage] = useState(false);

  // Determine available/default size considering per-size stock
  const getDefaultSize = () => {
    if (product.sizeStock && product.sizeStock.length > 0) {
      const firstAvailable = product.sizeStock.find((s) => s.stock > 0);
      return firstAvailable ? firstAvailable.size : product.sizeStock[0].size;
    }
    return product.sizes[0] || 'M';
  };

  const [selectedSize, setSelectedSize] = useState<string>(getDefaultSize());
  const [addedNotice, setAddedNotice] = useState(false);

  const handleMouseLeave = () => {
    setHoverSecondImage(false);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock || product.stockCount <= 0) return;
    
    // Ensure selected size isn't 0 stock
    if (product.sizeStock) {
      const sizeObj = product.sizeStock.find((s) => s.size === selectedSize);
      if (sizeObj && sizeObj.stock <= 0) return;
    }

    onAddToCart(product, selectedSize, product.colors[0]?.name || 'Noir');
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1600);
  };

  const currentImage = hoverSecondImage && product.images[1] ? product.images[1] : product.images[0];
  const isSoldOut = !product.inStock || product.stockCount <= 0;

  return (
    <div
      ref={cardRef}
      className="product-card"
      style={{
        cursor: 'pointer'
      }}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHoverSecondImage(true)}
      onClick={() => onSelect(product)}
    >
      {/* Product Image Section */}
      <div className="product-image-container">
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

        {/* Quick Size Selection & Add to Cart on Hover */}
        <div className="product-quick-actions" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', gap: 6, flexGrow: 1, overflowX: 'auto', alignItems: 'center' }}>
            {product.sizeStock && product.sizeStock.length > 0 ? (
              product.sizeStock.map((item) => {
                const isSizeOutOfStock = item.stock === 0;
                const isSelected = selectedSize === item.size;

                return (
                  <button
                    key={item.size}
                    type="button"
                    disabled={isSizeOutOfStock}
                    onClick={() => !isSizeOutOfStock && setSelectedSize(item.size)}
                    style={{
                      padding: '6px 10px',
                      background: isSizeOutOfStock
                        ? 'rgba(255, 255, 255, 0.01)'
                        : isSelected
                        ? 'var(--text-primary)'
                        : 'rgba(24, 24, 28, 0.85)',
                      color: isSizeOutOfStock
                        ? 'rgba(255, 255, 255, 0.2)'
                        : isSelected
                        ? 'var(--bg-deep)'
                        : 'var(--text-primary)',
                      border: '1px solid',
                      borderColor: isSizeOutOfStock ? 'rgba(255, 255, 255, 0.06)' : 'var(--border-medium)',
                      borderRadius: 2,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      cursor: isSizeOutOfStock ? 'not-allowed' : 'pointer',
                      textDecoration: isSizeOutOfStock ? 'line-through' : 'none',
                      opacity: isSizeOutOfStock ? 0.4 : 1,
                      whiteSpace: 'nowrap'
                    }}
                    title={isSizeOutOfStock ? `${item.size} is Sold Out` : `${item.size} (${item.stock} left)`}
                  >
                    {item.size.split('/')[0].trim()}
                  </button>
                );
              })
            ) : (
              product.sizes.map((s) => (
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
              ))
            )}
          </div>

          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleQuickAdd}
            className="btn-luxury"
            style={{
              padding: '8px 16px',
              fontSize: 11,
              whiteSpace: 'nowrap',
              opacity: isSoldOut ? 0.4 : 1,
              cursor: isSoldOut ? 'not-allowed' : 'pointer',
              background: isSoldOut ? 'var(--bg-card)' : undefined,
              color: isSoldOut ? 'var(--text-muted)' : undefined,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {isSoldOut ? (
              <span>SOLD OUT</span>
            ) : addedNotice ? (
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
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {product.stockCount > 0 && product.stockCount < 3 ? `${product.stockCount} LEFT` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}