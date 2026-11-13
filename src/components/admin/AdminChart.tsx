'use client';

import React, { useState, useMemo } from 'react';
import { DailyStat } from '@/types';
import { TrendingUp, DollarSign, ShoppingBag, Calendar, Sparkles, Award } from 'lucide-react';

interface AdminChartProps {
  data: DailyStat[];
  currency?: string;
  rangeLabel?: string;
}

export default function AdminChart({ data = [], currency = 'EGP', rangeLabel }: AdminChartProps) {
  const [metric, setMetric] = useState<'revenue' | 'orders'>('revenue');
  const [range, setRange] = useState<'all' | '7d' | '14d'>('all');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Filter data based on selected range
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (range === '7d' && data.length > 7) {
      return data.slice(-7);
    }
    if (range === '14d' && data.length > 14) {
      return data.slice(-14);
    }
    return data;
  }, [data, range]);

  // Compute stats for current view
  const { totalRevenue, totalOrders, maxVal, bestDay, avgValue } = useMemo(() => {
    if (chartData.length === 0) {
      return { totalRevenue: 0, totalOrders: 0, maxVal: 1, bestDay: null, avgValue: 0 };
    }

    const rev = chartData.reduce((sum, d) => sum + d.revenue, 0);
    const ord = chartData.reduce((sum, d) => sum + d.orders, 0);

    const values = chartData.map((d) => (metric === 'revenue' ? d.revenue : d.orders));
    const highest = Math.max(...values, metric === 'revenue' ? 1000 : 1);

    let topDay = chartData[0];
    chartData.forEach((d) => {
      const currentVal = metric === 'revenue' ? d.revenue : d.orders;
      const topVal = metric === 'revenue' ? topDay.revenue : topDay.orders;
      if (currentVal > topVal) {
        topDay = d;
      }
    });

    const avg = metric === 'revenue' ? Math.round(rev / chartData.length) : Math.round((ord / chartData.length) * 10) / 10;

    return {
      totalRevenue: rev,
      totalOrders: ord,
      maxVal: highest,
      bestDay: topDay,
      avgValue: avg
    };
  }, [chartData, metric]);

  // Default active point: the best day or the latest point
  const activePoint = selectedPointIndex !== null && chartData[selectedPointIndex]
    ? chartData[selectedPointIndex]
    : chartData[chartData.length - 1] || null;

  // Chart dimensions
  const width = 600;
  const height = 200;
  const paddingBottom = 34;
  const paddingTop = 20;
  const paddingLeft = 14;
  const paddingRight = 14;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;

  const barWidth = chartData.length > 0 ? Math.min(28, (chartWidth / chartData.length) * 0.58) : 20;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-medium)',
      borderRadius: 8,
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Chart Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-flex',
              padding: '2px 6px',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.08)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)'
            }}>
              REAL-TIME TREND
            </span>
            <span style={{ fontSize: 11, color: '#10b981', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="live-pulse-dot" style={{ width: 6, height: 6 }} />
              LIVE
            </span>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            letterSpacing: '0.08em',
            marginTop: 4,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            {metric === 'revenue' ? (
              <>
                <span>{totalRevenue.toLocaleString()} {currency}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
                  (Fulfilled &bull; {range === '7d' ? 'Past 7 Days' : '14 Days / This Month'})
                </span>
              </>
            ) : (
              <>
                <span>{totalOrders} Orders</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
                  (Fulfilled &bull; {range === '7d' ? 'Past 7 Days' : '14 Days / This Month'})
                </span>
              </>
            )}
          </h3>
        </div>

        {/* Controls: Metric Switcher & Timeframe */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Metric Toggle */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding: 2
          }}>
            <button
              type="button"
              onClick={() => { setMetric('revenue'); setSelectedPointIndex(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 12px',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                borderRadius: 4,
                background: metric === 'revenue' ? '#ffffff' : 'transparent',
                color: metric === 'revenue' ? '#000000' : 'var(--text-muted)',
                fontWeight: metric === 'revenue' ? 600 : 400,
                transition: 'all 0.15s ease'
              }}
            >
              <DollarSign size={12} />
              <span>Revenue</span>
            </button>

            <button
              type="button"
              onClick={() => { setMetric('orders'); setSelectedPointIndex(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 12px',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                borderRadius: 4,
                background: metric === 'orders' ? '#ffffff' : 'transparent',
                color: metric === 'orders' ? '#000000' : 'var(--text-muted)',
                fontWeight: metric === 'orders' ? 600 : 400,
                transition: 'all 0.15s ease'
              }}
            >
              <ShoppingBag size={12} />
              <span>Orders</span>
            </button>
          </div>

          {/* Timeframe Toggle */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding: 2
          }}>
            <button
              type="button"
              onClick={() => { setRange('7d'); setSelectedPointIndex(null); }}
              style={{
                padding: '6px 10px',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                borderRadius: 4,
                background: range === '7d' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: range === '7d' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600
              }}
            >
              7D
            </button>
            <button
              type="button"
              onClick={() => { setRange('14d'); setSelectedPointIndex(null); }}
              style={{
                padding: '6px 10px',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                borderRadius: 4,
                background: range === '14d' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: range === '14d' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600
              }}
            >
              14D
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Card for Selected / Tapped Day */}
      {activePoint && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-medium)',
          borderRadius: 6,
          padding: '10px 14px',
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>
              {activePoint.dayLabel}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ({activePoint.date})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontFamily: 'var(--font-mono)' }}>
                Day Revenue
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>
                {activePoint.revenue.toLocaleString()} {currency}
              </span>
            </div>

            <div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontFamily: 'var(--font-mono)' }}>
                Orders
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#93c5fd', fontFamily: 'var(--font-mono)' }}>
                {activePoint.orders} {activePoint.orders === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {activePoint.aov > 0 && (
              <div style={{ display: 'none', }} className="hidden-sm-flex">
                <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontFamily: 'var(--font-mono)' }}>
                  Avg Order
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                  {activePoint.aov.toLocaleString()} {currency}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive SVG Chart */}
      <div style={{ width: '100%', position: 'relative', touchAction: 'pan-y' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', maxHeight: 220, display: 'block' }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Subtle Gradient for Active Bar */}
            <linearGradient id="barGradientPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#71717a" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="barGradientAccent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.35" />
            </linearGradient>

            <linearGradient id="barGradientNormal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#18181b" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0, 0.33, 0.66, 1].map((pct, idx) => {
            const y = paddingTop + chartHeight * (1 - pct);
            const valLabel = metric === 'revenue'
              ? `${Math.round((maxVal * pct) / 1000)}k`
              : `${Math.round(maxVal * pct)}`;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="3 3"
                />
                <text
                  x={width - paddingRight}
                  y={y - 4}
                  textAnchor="end"
                  fill="rgba(255, 255, 255, 0.25)"
                  fontSize="9"
                  fontFamily="Space Grotesk, monospace"
                >
                  {valLabel}
                </text>
              </g>
            );
          })}

          {/* Area spline fill connecting tops of bars */}
          {chartData.length > 1 && (
            (() => {
              const points = chartData.map((d, i) => {
                const step = chartWidth / chartData.length;
                const cx = paddingLeft + i * step + step / 2;
                const val = metric === 'revenue' ? d.revenue : d.orders;
                const cy = paddingTop + chartHeight - (val / (maxVal || 1)) * chartHeight;
                return `${cx},${cy}`;
              });

              const areaD = `M ${points[0]} L ${points.join(' L ')} L ${paddingLeft + chartWidth},${paddingTop + chartHeight} L ${paddingLeft},${paddingTop + chartHeight} Z`;
              const lineD = `M ${points.join(' L ')}`;

              return (
                <>
                  <path d={areaD} fill="url(#areaGradient)" />
                  <path d={lineD} fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                </>
              );
            })()
          )}

          {/* Bars for Each Day */}
          {chartData.map((d, i) => {
            const step = chartWidth / chartData.length;
            const x = paddingLeft + i * step + (step - barWidth) / 2;
            const val = metric === 'revenue' ? d.revenue : d.orders;
            const barHeight = Math.max(3, (val / (maxVal || 1)) * chartHeight);
            const y = paddingTop + chartHeight - barHeight;

            const isSelected = selectedPointIndex === i || (selectedPointIndex === null && i === chartData.length - 1);
            const isHighest = bestDay && (metric === 'revenue' ? d.revenue === bestDay.revenue : d.orders === bestDay.orders) && val > 0;

            const fillUrl = isHighest
              ? 'url(#barGradientAccent)'
              : isSelected
              ? 'url(#barGradientPrimary)'
              : 'url(#barGradientNormal)';

            return (
              <g
                key={d.date}
                onClick={() => setSelectedPointIndex(i)}
                style={{ cursor: 'pointer' }}
              >
                {/* Invisible wide hit area for easy finger tapping on mobile */}
                <rect
                  x={paddingLeft + i * step}
                  y={paddingTop}
                  width={step}
                  height={chartHeight + paddingBottom}
                  fill="transparent"
                />

                {/* Vertical Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="3"
                  ry="3"
                  fill={fillUrl}
                  stroke={isSelected ? '#ffffff' : isHighest ? '#10b981' : 'transparent'}
                  strokeWidth={isSelected ? 1.5 : 1}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Peak Crown / Glow Dot on Top */}
                {isHighest && val > 0 && (
                  <circle
                    cx={x + barWidth / 2}
                    cy={y - 4}
                    r="3"
                    fill="#10b981"
                    stroke="#000"
                    strokeWidth="1"
                  />
                )}

                {/* X-Axis Day Label */}
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.45)'}
                  fontSize={chartData.length > 10 ? '8.5' : '10'}
                  fontFamily="Space Grotesk, monospace"
                  fontWeight={isSelected ? '600' : '400'}
                >
                  {chartData.length > 10 ? d.shortDate : d.dayLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Executive Key Takeaways Strip for Business Owners */}
      <div style={{
        marginTop: 16,
        paddingTop: 14,
        borderTop: '1px solid var(--border-subtle)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12
      }}>
        {/* Metric 1: Peak Performing Day */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '8px 12px',
          borderRadius: 4
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <Award size={14} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Highest Day
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {bestDay && (metric === 'revenue' ? bestDay.revenue : bestDay.orders) > 0 ? (
                <>
                  {metric === 'revenue'
                    ? `${bestDay.revenue.toLocaleString()} ${currency}`
                    : `${bestDay.orders} Orders`}
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>({bestDay.dayLabel})</span>
                </>
              ) : (
                'No orders yet'
              )}
            </div>
          </div>
        </div>

        {/* Metric 2: Daily Average */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '8px 12px',
          borderRadius: 4
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <TrendingUp size={14} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Daily Average Pace
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {metric === 'revenue'
                ? `~${avgValue.toLocaleString()} ${currency} / day`
                : `${avgValue} orders / day`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
