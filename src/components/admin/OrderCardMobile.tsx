'use client';

import React from 'react';
import { Order } from '@/types';
import { ShoppingBag, Eye, Phone, MapPin, Clock, CheckCircle2, ChevronRight, Truck, Trash2 } from 'lucide-react';

interface OrderCardMobileProps {
  order: Order;
  currency?: string;
  onSelect: (order: Order) => void;
  onPreviewEmail: (orderId: string) => void;
  onDelete: (orderId: string, orderNumber: string) => void;
}

export default function OrderCardMobile({
  order,
  currency = 'EGP',
  onSelect,
  onPreviewEmail,
  onDelete
}: OrderCardMobileProps) {
  const timeFormatted = new Date(order.createdAt).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  }) + ' at ' + new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 8,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
        transition: 'border-color 0.15s ease'
      }}
    >
      {/* Card Header: Order # + Status Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 14,
            color: '#ffffff',
            letterSpacing: '0.05em'
          }}>
            {order.orderNumber}
          </span>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            {timeFormatted}
          </div>
        </div>

        <span className={`status-pill ${order.status}`} style={{ fontSize: 10, padding: '4px 10px', textTransform: 'uppercase' }}>
          {order.status}
        </span>
      </div>

      {/* Customer Info & Quick Action (Call Button) */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 6,
        padding: '10px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {order.customer.firstName} {order.customer.lastName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <MapPin size={11} color="var(--text-muted)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {order.shippingAddress.city || 'Cairo'}, {order.shippingAddress.country || 'Egypt'}
            </span>
          </div>
        </div>

        {/* 1-Tap Phone Call Button for Quick Logistics Coordination */}
        {order.customer.phone && (
          <a
            href={`tel:${order.customer.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="touch-target"
            style={{
              padding: '8px 12px',
              borderRadius: 4,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            title="Call Client"
          >
            <Phone size={12} />
            <span>CALL</span>
          </a>
        )}
      </div>

      {/* Item Previews Strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {order.items.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 4,
              border: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
          >
            <div style={{ width: 28, height: 36, borderRadius: 2, overflow: 'hidden', background: '#222' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#fff', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {item.quantity}x &bull; {item.size}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Total & Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block' }}>
            ORDER TOTAL
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: '#ffffff' }}>
            {Number(order.total || 0).toLocaleString()} {currency}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => onPreviewEmail(order.id)}
            className="btn-icon touch-target"
            style={{ width: 36, height: 36, borderRadius: 4 }}
            title="Preview Alert Email"
          >
            <Eye size={15} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(order.id, order.orderNumber)}
            className="btn-icon touch-target"
            style={{ width: 36, height: 36, borderRadius: 4, color: '#fca5a5' }}
            title="Delete Order"
          >
            <Trash2 size={15} />
          </button>

          <button
            type="button"
            onClick={() => onSelect(order)}
            className="btn-luxury touch-target"
            style={{ padding: '8px 14px', fontSize: 11, borderRadius: 4 }}
          >
            <span>MANAGE</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
