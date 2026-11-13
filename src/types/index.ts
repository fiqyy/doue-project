export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: 'outerwear' | 'knitwear' | 'trousers' | 'leather';
  description: string;
  details: string[];
  materials: string;
  care: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  badge?: string; // e.g. "Runway SS26", "Limited Edition", "Signature"
  modelDetails?: string; // e.g. "Model is 6'2\" / 188cm wearing size L"
  threeDType?: 'coat' | 'blazer' | 'trousers';
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  shippingMethod: 'standard' | 'express_courier';
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod?: 'cod' | 'card' | 'instapay_wallet';
  governorate?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
  adminEmailNotified: boolean;
  customerEmailNotified: boolean;
  giftPackaging?: boolean;
};

export type EmailNotification = {
  id: string;
  orderId: string;
  orderNumber: string;
  recipientEmail: string;
  type: 'admin_new_order' | 'customer_confirmation' | 'order_status_update';
  subject: string;
  sentAt: string;
  status: 'sent' | 'simulated';
  previewUrl?: string;
  contentHtml?: string;
};

export type DailyStat = {
  date: string;
  dayLabel: string;
  shortDate: string;
  revenue: number;
  orders: number;
  aov: number;
};

export type AdminStats = {
  totalRevenue: number;
  thisMonthRevenue: number;
  totalOrders: number;
  thisMonthOrders: number;
  averageOrderValue: number;
  thisMonthAOV: number;
  thisMonthAvgOrdersPerDay: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: Order[];
  dailyChartData: DailyStat[];
  growth: {
    revenueGrowthMoM: number;
    ordersGrowthMoM: number;
  };
};

export type AdminSettings = {
  adminEmail: string;
  storeName: string;
  currency: string;
  smtpConfigured: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  senderName: string;
};
