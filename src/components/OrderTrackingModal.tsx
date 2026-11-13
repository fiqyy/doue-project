'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Search, CheckCircle2, Clock, Truck, Package, MapPin, ExternalLink } from 'lucide-react';
import { Order } from '@/types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export default function OrderTrackingModal({
  isOpen,
  onClose,
  initialOrderNumber = ''
}: OrderTrackingModalProps) {
  const [query, setQuery] = useState(initialOrderNumber || ' ');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (orderId: string) => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Acquisition reference not found in registry');
      }
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      if (initialOrderNumber) {
        setQuery(initialOrderNumber);
        fetchOrder(initialOrderNumber);
      } else {
        fetchOrder(' '); // Demo preset
      }
    }
  }, [isOpen, initialOrderNumber]);

  if (!isOpen) return null;

  const steps = [
    { key: 'pending', label: 'Order Confirmed', desc: 'Logged in atelier database' },
    { key: 'processing', label: 'Atelier Tailoring', desc: 'Hand finishing & quality check' },
    { key: 'shipped', label: 'Courier Dispatched', desc: 'In insured transit' },
    { key: 'delivered', label: 'Arrived at Destination', desc: 'Signed & received' }
  ];

  const getStepStatus = (stepKey: string) => {
    if (!order) return 'upcoming';
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIdx = statusOrder.indexOf(order.status);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720, padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.12em', marginTop: 2 }}>
              TRACK YOUR ACQUISITION
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: 36, height: 36 }}>
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '20px 32px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrder(query);
            }}
            style={{ display: 'flex', gap: 10 }}
          >
            <input
              type="text"
              placeholder="Enter Order Reference (e.g. DOUE-84920)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flexGrow: 1, padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13 }}
            />
            <button type="submit" className="btn-luxury" style={{ padding: '12px 24px', fontSize: 11 }}>
              <Search size={14} />
              <span>TRACK</span>
            </button>
          </form>

          {error && (
            <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 10, fontFamily: 'var(--font-mono)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  margin: '0 auto 16px auto',
                  animation: 'spin 0.8s linear infinite'
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                QUERYING ATELIER VAULT...
              </span>
            </div>
          )}

          {order && !loading && (
            <div>
              {/* Order Meta Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>ORDER NUMBER</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                    {order.orderNumber}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>CURRENT STATUS</div>
                  <div className={`status-pill ${order.status}`} style={{ marginTop: 4 }}>
                    {order.status.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Visual Step Progress Line */}
              <div style={{ position: 'relative', margin: '36px 0 44px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, position: 'relative', zIndex: 2 }}>
                  {steps.map((s, idx) => {
                    const status = getStepStatus(s.key);
                    return (
                      <div key={s.key} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: status === 'completed' || status === 'current' ? '#ffffff' : 'var(--bg-card)',
                            color: status === 'completed' || status === 'current' ? 'var(--bg-deep)' : 'var(--text-muted)',
                            border: '1px solid var(--border-medium)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 10px auto',
                            fontWeight: 700,
                            fontSize: 12,
                            boxShadow: status === 'current' ? '0 0 15px rgba(255,255,255,0.4)' : 'none'
                          }}
                        >
                          {status === 'completed' ? <CheckCircle2 size={16} /> : idx + 1}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: status === 'upcoming' ? 'var(--text-muted)' : '#ffffff' }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
                          {s.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carrier & Tracking details */}
              {order.trackingNumber && (
                <div style={{ padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 4, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>INSURED CARRIER & WAYBILL</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 2 }}>
                      {order.carrier || 'DHL Express Worldwide'} &bull; <span style={{ fontFamily: 'var(--font-mono)' }}>{order.trackingNumber}</span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(order.trackingNumber)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury-outline"
                    style={{ padding: '6px 14px', fontSize: 11 }}
                  >
                    <span>COURIER PORTAL</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Destination Address */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 4, marginBottom: 24 }}>
                <MapPin size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#fff' }}>{order.customer.firstName} {order.customer.lastName}</strong><br />
                  {order.shippingAddress.address} {order.shippingAddress.apartment && `(${order.shippingAddress.apartment})`}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </div>
              </div>

              {/* Items in order */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                  ACQUIRED PIECES ({order.items.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 2 }}>
                      <div style={{ position: 'relative', width: 44, height: 56, flexShrink: 0, borderRadius: 2, overflow: 'hidden' }}>
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          Size: {item.size} &bull; Qty: {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>
                        {(item.price * item.quantity).toLocaleString()} EGP
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
