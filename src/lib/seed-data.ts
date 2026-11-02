import { Product, Order, AdminSettings } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'doue-001',
    name: 'Atelier Cashmere Overcoat',
    subtitle: 'Double-Faced Wool & Mongolian Cashmere / Noir & Brown',
    price: 5850,
    originalPrice: 6500,
    category: 'outerwear',
    description: 'Sculptural trench overcoat hand-tailored from double-faced virgin wool and cashmere blend. Features an unlined architectural drop-shoulder cut, pick lapels, matte horn buttons, and deep storm flaps with concealed brushed titanium clasps.',
    details: [
      'Double-Faced Wool & Cashmere blend (680gsm)',
      'Unstructured architectural drop-shoulder cut',
      'Matte black buffalo horn buttons',
      'Interior breast pocket with laser-etched serial plate',
      'Handcrafted in Cairo Boutique Atelier'
    ],
    materials: '80% Virgin Wool, 20% Mongolian Cashmere; Cupro lining in sleeves',
    care: 'Specialist luxury dry clean only. Store on wooden atelier hanger.',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0a0a0a' },
      { name: 'Rich Brown', hex: '#3d2817' }
    ],
    sizes: ['46 / S', '48 / M', '50 / L', '52 / XL'],
    inStock: true,
    stockCount: 12,
    featured: true,
    badge: 'COLLECTION SS26',
    modelDetails: 'Model is 185cm wearing size 48 / M',
    threeDType: 'coat'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-84920',
    orderNumber: 'DOUE-84920',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    customer: {
      firstName: 'Kareem',
      lastName: 'El-Sayed',
      email: 'kareem.elsayed@gmail.com',
      phone: '01012345678'
    },
    shippingAddress: {
      address: 'South 90th Street, Fifth Settlement (Tagamoa)',
      apartment: 'Villa 14',
      city: 'New Cairo',
      state: 'Cairo',
      postalCode: '11835',
      country: 'Egypt'
    },
    items: [
      {
        productId: 'doue-001',
        name: 'Atelier Cashmere Overcoat',
        price: 5850,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
        size: '50 / L',
        color: 'Obsidian Black',
        quantity: 1
      }
    ],
    subtotal: 5850,
    discount: 585,
    discountCode: 'DOUEVIP10',
    shippingFee: 45,
    shippingMethod: 'express_courier',
    tax: 468,
    total: 5733,
    status: 'processing',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    governorate: 'Cairo',
    trackingNumber: 'BOSTA-EG-998214',
    carrier: 'Bosta Express Egypt',
    estimatedDelivery: 'Tomorrow (24-48 hrs)',
    notes: 'Please call client before delivery. Inspection on delivery allowed.',
    adminEmailNotified: true,
    customerEmailNotified: true,
    giftPackaging: true
  }
];

export const INITIAL_SETTINGS: AdminSettings = {
  adminEmail: 'fiqyyyy@gmail.com',
  storeName: 'DOUE Egypt',
  currency: 'EGP',
  smtpConfigured: true,
  senderName: 'DOUE Egypt Atelier'
};