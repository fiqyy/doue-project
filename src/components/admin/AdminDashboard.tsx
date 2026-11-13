'use client';

import React from 'react';
import { AdminStats, Order, Product } from '@/types';
import AdminChart from './AdminChart';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Shield,
  Eye,
  Phone
} from 'lucide-react';

interface AdminDashboardProps {
  stats: AdminStats | null;
  orders: Order[];
  products: Product[];
  currency?: string;
  refreshing: boolean;
  onRefresh: () => void;
  onNavigateTab: (tab: 'orders' | 'emails' | 'products' | 'settings', filter?: string) => void;
  onSelectOrder: (order: Order) => void;
  onOpenAddProduct: () => void;
}

export default function AdminDashboard({
  stats,
  orders,
  products,
  currency = 'EGP',
  refreshing,
  onRefresh,
  onNavigateTab,
  onSelectOrder,
  onOpenAddProduct
}: AdminDashboardProps) {
  // If stats not loaded yet
  if (!stats) {
    return (
      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: 8,
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px auto'
        }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          SYNCHRONIZING REAL-TIME ATELIER METRICS...
        </p>
      </div>
    );
  }

  const thisMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* 1. Real-Time Status & Live Sync Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(20,20,26,0.95) 0%, rgba(12,12,15,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="live-pulse-dot" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#10b981' }}>
                REAL-TIME FEED ACTIVE
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                &bull; Auto-sync enabled
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
             Overview for {thisMonthName} &bull;
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="btn-luxury-outline"
            style={{
              padding: '7px 14px',
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 4
            }}
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'SYNCING...' : 'SYNC DATA'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Executive KPI Cards (2x2 on mobile, 4-col on desktop) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16
      }}>
        {/* KPI 1: REVENUE THIS MONTH */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 8,
          padding: '20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  display: 'block'
                }}>
                  REVENUE THIS MONTH
                </span>
                <span style={{
                  fontSize: 10,
                  color: '#6ee7b7',
                  fontFamily: 'var(--font-mono)',
                  display: 'inline-block',
                  marginTop: 2
                }}>
                  (Shipped & Delivered Only)
                </span>
              </div>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6ee7b7'
              }}>
                <DollarSign size={16} />
              </div>
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(22px, 5vw, 28px)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              {stats.thisMonthRevenue.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{currency}</span>
            </div>
          </div>

          <div style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 11
          }}>
            <span style={{
              color: stats.growth.revenueGrowthMoM >= 0 ? '#6ee7b7' : '#fca5a5',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              fontWeight: 600
            }}>
              {stats.growth.revenueGrowthMoM >= 0 ? '▲ +' : '▼ '}
              {Math.abs(stats.growth.revenueGrowthMoM)}% vs last month
            </span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Fulfilled All-Time: {stats.totalRevenue.toLocaleString()} {currency}
            </span>
          </div>
        </div>

        {/* KPI 2: ORDERS THIS MONTH */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 8,
          padding: '20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  display: 'block'
                }}>
                  TOTAL ORDERS THIS MONTH
                </span>
                <span style={{
                  fontSize: 10,
                  color: '#93c5fd',
                  fontFamily: 'var(--font-mono)',
                  display: 'inline-block',
                  marginTop: 2
                }}>
                  (Shipped & Delivered Only)
                </span>
              </div>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#93c5fd'
              }}>
                <ShoppingBag size={16} />
              </div>
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(22px, 5vw, 28px)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              {stats.thisMonthOrders} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Fulfilled Pieces</span>
            </div>
          </div>

          <div style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 11
          }}>
            <span style={{
              color: stats.growth.ordersGrowthMoM >= 0 ? '#93c5fd' : '#fca5a5',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              fontWeight: 600
            }}>
              {stats.growth.ordersGrowthMoM >= 0 ? '▲ +' : '▼ '}
              {Math.abs(stats.growth.ordersGrowthMoM)}% pacing
            </span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              All-Time: {stats.totalOrders} Orders
            </span>
          </div>
        </div>

        {/* KPI 3: AVERAGE ORDERS THIS MONTH (AOV & DAILY AVERAGE) */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 8,
          padding: '20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase'
              }}>
                AVG ORDERS THIS MONTH
              </span>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d8b4fe'
              }}>
                <TrendingUp size={16} />
              </div>
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(22px, 5vw, 28px)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              {stats.thisMonthAOV.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{currency} / Order</span>
            </div>
          </div>

          <div style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 11
          }}>
            <span style={{ color: '#d8b4fe', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              ~{stats.thisMonthAvgOrdersPerDay} orders / day
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>
              Avg ticket size
            </span>
          </div>
        </div>

        {/* KPI 4: ATELIER CATALOG & FULFILLMENT VELOCITY */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 8,
          padding: '20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase'
              }}>
                FULFILLMENT VELOCITY
              </span>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Truck size={16} />
              </div>
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(22px, 5vw, 28px)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              {stats.pendingOrders + stats.processingOrders} <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>Active</span>
            </div>
          </div>

          <div style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 11
          }}>
            <span style={{ color: stats.pendingOrders > 0 ? '#fde047' : '#6ee7b7', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {stats.pendingOrders > 0 ? `${stats.pendingOrders} need review` : 'All caught up'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {stats.shippedOrders} in transit
            </span>
          </div>
        </div>
      </div>

      {/* 3. Small Interactive Real-Time Chart */}
      <div>
        <AdminChart data={stats.dailyChartData} currency={currency} />
      </div>

      {/* 4. Actionable Fulfillment Pipeline Tracker */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 8,
        padding: '18px 20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase'
          }}>
            OPERATIONAL ORDER PIPELINE (TAP TO FILTER)
          </span>
          <button
            onClick={() => onNavigateTab('orders', 'all')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>View All ({orders.length})</span>
            <ChevronRight size={12} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 10
        }}>
          {/* Pending */}
          <button
            type="button"
            onClick={() => onNavigateTab('orders', 'pending')}
            style={{
              background: stats.pendingOrders > 0 ? 'rgba(234, 179, 8, 0.08)' : 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              borderRadius: 6,
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Clock size={12} color="#eab308" />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#fde047', textTransform: 'uppercase' }}>
                Pending
              </span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#fff' }}>
              {stats.pendingOrders}
            </div>
          </button>

          {/* Processing */}
          <button
            type="button"
            onClick={() => onNavigateTab('orders', 'processing')}
            style={{
              background: stats.processingOrders > 0 ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: 6,
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Package size={12} color="#3b82f6" />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#93c5fd', textTransform: 'uppercase' }}>
                Processing
              </span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#fff' }}>
              {stats.processingOrders}
            </div>
          </button>

          {/* Shipped */}
          <button
            type="button"
            onClick={() => onNavigateTab('orders', 'shipped')}
            style={{
              background: stats.shippedOrders > 0 ? 'rgba(168, 85, 247, 0.08)' : 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: 6,
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Truck size={12} color="#a855f7" />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#d8b4fe', textTransform: 'uppercase' }}>
                In Transit
              </span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#fff' }}>
              {stats.shippedOrders}
            </div>
          </button>

          {/* Delivered */}
          <button
            type="button"
            onClick={() => onNavigateTab('orders', 'delivered')}
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 6,
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <CheckCircle2 size={12} color="#10b981" />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#6ee7b7', textTransform: 'uppercase' }}>
                Delivered
              </span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#fff' }}>
              {stats.deliveredOrders}
            </div>
          </button>
        </div>
      </div>

      {/* 5. Quick Actions Bar for Business Owners */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12
      }}>
        <button
          onClick={onOpenAddProduct}
          className="btn-luxury"
          style={{
            padding: '14px',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 6
          }}
        >
          <Plus size={14} />
          <span>ADD LUXURY PIECE</span>
        </button>

        <button
          onClick={() => onNavigateTab('orders', 'pending')}
          className="btn-luxury-outline"
          style={{
            padding: '14px',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 6
          }}
        >
          <Clock size={14} />
          <span>PENDING ORDERS ({stats.pendingOrders})</span>
        </button>

        <button
          onClick={() => onNavigateTab('emails')}
          className="btn-luxury-outline"
          style={{
            padding: '14px',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 6
          }}
        >
          <Shield size={14} />
          <span>ADMIN EMAIL DISPATCH</span>
        </button>
      </div>

      {/* 6. Recent Real-Time Orders Feed */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 8,
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', color: '#fff' }}>
              RECENT CLIENT ACQUISITIONS
            </h3>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Real-time incoming orders from boutique storefront
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('orders', 'all')}
            className="btn-luxury-outline"
            style={{ padding: '6px 12px', fontSize: 11, gap: 4 }}
          >
            <span>VIEW ALL</span>
            <ArrowUpRight size={12} />
          </button>
        </div>

        {/* Orders Mobile Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orders.slice(0, 5).map((order) => {
            const timeAgo = (() => {
              const diffMs = Date.now() - new Date(order.createdAt).getTime();
              const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
              if (diffHrs < 1) return 'Just now';
              if (diffHrs < 24) return `${diffHrs}h ago`;
              const diffDays = Math.floor(diffHrs / 24);
              return `${diffDays}d ago`;
            })();

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 6,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  {/* Order piece thumbnail preview */}
                  <div style={{
                    width: 36,
                    height: 46,
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: '#1a1a20',
                    flexShrink: 0,
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {order.items[0]?.image ? (
                      <img src={order.items[0].image} alt="piece" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingBag size={14} color="var(--text-muted)" />
                      </div>
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: '#fff' }}>
                        {order.orderNumber}
                      </span>
                      <span className={`status-pill ${order.status}`} style={{ fontSize: 9, padding: '2px 6px' }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {order.customer.firstName} {order.customer.lastName} &bull; {order.shippingAddress.city || 'Cairo'}
                    </div>

                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      {timeAgo} &bull; {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: '#fff' }}>
                    {order.total.toLocaleString()} {currency}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrder(order);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      marginTop: 4,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <span>Manage</span>
                    <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
