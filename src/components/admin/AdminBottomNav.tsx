'use client';

import React from 'react';
import { LucideIcon, TrendingUp, ShoppingBag, Package, Mail, Sliders } from 'lucide-react';

interface AdminBottomNavProps {
  activeTab: 'dashboard' | 'orders' | 'emails' | 'products' | 'settings';
  onTabChange: (tab: 'dashboard' | 'orders' | 'emails' | 'products' | 'settings') => void;
  pendingOrdersCount?: number;
  totalProductsCount?: number;
}

interface TabItem {
  id: 'dashboard' | 'orders' | 'emails' | 'products' | 'settings';
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export default function AdminBottomNav({
  activeTab,
  onTabChange,
  pendingOrdersCount = 0,
  totalProductsCount = 0
}: AdminBottomNavProps) {
  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'products', label: 'Catalog', icon: Package },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'settings', label: 'Config', icon: Sliders }
  ];

  return (
    <nav className="admin-mobile-bottom-bar" aria-label="Mobile Admin Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`admin-bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-selected={isActive}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.6} />
              {tab.badge !== undefined && (
                <span className="admin-bottom-nav-badge" style={{ background: '#f59e0b', color: '#000' }}>
                  {tab.badge}
                </span>
              )}
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
