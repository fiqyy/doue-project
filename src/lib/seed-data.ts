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
  },
  {
    id: 'doue-002',
    name: 'Monochrome Tailored Blazer',
    subtitle: 'Italian Barathea Wool / Structured Peak Lapel',
    price: 4950,
    originalPrice: 5500,
    category: 'outerwear',
    description: 'Sharp single-breasted evening blazer sculpted with structured horsehair canvas construction, suppressed waist, and hand-rolled silk grosgrain buttonholes.',
    details: [
      '100% Super 150s Barathea Wool',
      'Full floating canvas inner construction',
      'Horn buttons with engraved atelier serial',
      'Twin vents and jetted welt pockets'
    ],
    materials: '100% Barathea Wool; Pure Bemberg Silk lining',
    care: 'Specialist dry clean only.',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0a0a0a' },
      { name: 'Slate Charcoal', hex: '#26262b' }
    ],
    sizes: ['46 / S', '48 / M', '50 / L', '52 / XL'],
    inStock: true,
    stockCount: 6,
    featured: true,
    badge: 'SIGNATURE PIECE',
    modelDetails: 'Model is 188cm wearing size 50 / L',
    threeDType: 'blazer'
  },
  {
    id: 'doue-003',
    name: 'Architectural Pleated Trousers',
    subtitle: 'High-Waist Drape / Double Forward Pleats',
    price: 3250,
    originalPrice: 3800,
    category: 'trousers',
    description: 'High-waisted trousers crafted with an elegant forward double pleat, extended tab waistband with side adjusters, and a clean wide taper silhouette.',
    details: [
      'Pure Worsted Wool Flannel',
      'Side waist adjusters in matte titanium',
      'Unhemmed length for tailored precision'
    ],
    materials: '100% Worsted Wool Flannel (340gsm)',
    care: 'Dry clean only.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0a0a0a' },
      { name: 'Ash Grey', hex: '#4a4a52' }
    ],
    sizes: ['46 / S', '48 / M', '50 / L', '52 / XL'],
    inStock: true,
    stockCount: 8,
    featured: false,
    badge: 'ATELIER ESSENTIAL',
    modelDetails: 'Model is 185cm wearing size 48 / M',
    threeDType: 'trousers'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-84920',
    orderNumber: 'DOUE-84920',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
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
    status: 'pending',
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
  },
  {
    id: 'ord-84918',
    orderNumber: 'DOUE-84918',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    customer: {
      firstName: 'Nourhan',
      lastName: 'Mansour',
      email: 'nourhan.mansour@gmail.com',
      phone: '01123456789'
    },
    shippingAddress: {
      address: 'Palm Hills October, Compound Gate 2',
      apartment: 'Villa 82',
      city: 'Sheikh Zayed',
      state: 'Giza',
      postalCode: '12588',
      country: 'Egypt'
    },
    items: [
      {
        productId: 'doue-001',
        name: 'Atelier Cashmere Overcoat',
        price: 5850,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
        size: '48 / M',
        color: 'Rich Brown',
        quantity: 2
      }
    ],
    subtotal: 11700,
    discount: 0,
    shippingFee: 0,
    shippingMethod: 'express_courier',
    tax: 0,
    total: 11700,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    governorate: 'Giza',
    trackingNumber: 'DHL-EG-7749102',
    carrier: 'DHL Express Egypt',
    estimatedDelivery: 'In Transit',
    notes: 'Signature required on delivery.',
    adminEmailNotified: true,
    customerEmailNotified: true,
    giftPackaging: true
  },
  {
    id: 'ord-84915',
    orderNumber: 'DOUE-84915',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 68).toISOString(),
    customer: {
      firstName: 'Tarek',
      lastName: 'El-Kady',
      email: 'tarek.kady@outlook.com',
      phone: '01234567890'
    },
    shippingAddress: {
      address: 'Kornish El-Nile, Kafr Abdo',
      apartment: 'Flat 9B',
      city: 'Alexandria',
      state: 'Alexandria',
      postalCode: '21523',
      country: 'Egypt'
    },
    items: [
      {
        productId: 'doue-002',
        name: 'Monochrome Tailored Blazer',
        price: 4950,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
        size: '48 / M',
        color: 'Obsidian Black',
        quantity: 1
      }
    ],
    subtotal: 4950,
    discount: 0,
    shippingFee: 50,
    shippingMethod: 'express_courier',
    tax: 0,
    total: 5000,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'instapay_wallet',
    governorate: 'Alexandria',
    trackingNumber: 'ARAMEX-EG-389102',
    carrier: 'Aramex Priority',
    estimatedDelivery: 'Out for delivery',
    adminEmailNotified: true,
    customerEmailNotified: true
  },
  {
    id: 'ord-84910',
    orderNumber: 'DOUE-84910',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 118).toISOString(),
    customer: {
      firstName: 'Yasmine',
      lastName: 'Zahran',
      email: 'yasmine.z@atelier.eg',
      phone: '01099887766'
    },
    shippingAddress: {
      address: 'Degla Valley, Street 199',
      apartment: 'Penthouse 4',
      city: 'Maadi',
      state: 'Cairo',
      postalCode: '11435',
      country: 'Egypt'
    },
    items: [
      {
        productId: 'doue-001',
        name: 'Atelier Cashmere Overcoat',
        price: 5850,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
        size: '46 / S',
        color: 'Obsidian Black',
        quantity: 1
      },
      {
        productId: 'doue-003',
        name: 'Architectural Pleated Trousers',
        price: 3250,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
        size: '46 / S',
        color: 'Obsidian Black',
        quantity: 1
      }
    ],
    subtotal: 9100,
    discount: 900,
    shippingFee: 0,
    shippingMethod: 'express_courier',
    tax: 0,
    total: 8200,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    governorate: 'Cairo',
    trackingNumber: 'BOSTA-EG-883901',
    carrier: 'Bosta Express Egypt',
    estimatedDelivery: 'Delivered',
    adminEmailNotified: true,
    customerEmailNotified: true,
    giftPackaging: true
  },
  {
    id: 'ord-84905',
    orderNumber: 'DOUE-84905',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString(),
    customer: {
      firstName: 'Omar',
      lastName: 'Farouk',
      email: 'omar.farouk@corp.com',
      phone: '01055443322'
    },
    shippingAddress: {
      address: 'Zamalek, Gezira Street',
      apartment: 'Apt 12',
      city: 'Zamalek',
      state: 'Cairo',
      postalCode: '11211',
      country: 'Egypt'
    },
    items: [
      {
        productId: 'doue-001',
        name: 'Atelier Cashmere Overcoat',
        price: 5850,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
        size: '52 / XL',
        color: 'Obsidian Black',
        quantity: 3
      }
    ],
    subtotal: 17550,
    discount: 0,
    shippingFee: 0,
    shippingMethod: 'express_courier',
    tax: 0,
    total: 17550,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    governorate: 'Cairo',
    trackingNumber: 'DHL-EG-6638102',
    carrier: 'DHL Express Egypt',
    estimatedDelivery: 'Delivered',
    adminEmailNotified: true,
    customerEmailNotified: true
  },
  {
    id: 'ord-84890',
    orderNumber: 'DOUE-84890',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 250).toISOString(),
    customer: {
      firstName: 'Laila',
      lastName: 'Mourad',
      email: 'laila.mourad@gmail.com',
      phone: '01222334455'
    },
    shippingAddress: {
      address: 'Heliopolis, Korba Quarter',
      apartment: 'Floor 3',
      city: 'Heliopolis',
      state: 'Cairo',
      postalCode: '11341',
      country: 'Egypt'
    },
    items: [
      {
        productId: 'doue-001',
        name: 'Atelier Cashmere Overcoat',
        price: 5850,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
        size: '48 / M',
        color: 'Obsidian Black',
        quantity: 2
      },
      {
        productId: 'doue-003',
        name: 'Architectural Pleated Trousers',
        price: 3250,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
        size: '48 / M',
        color: 'Ash Grey',
        quantity: 1
      }
    ],
    subtotal: 14950,
    discount: 550,
    shippingFee: 0,
    shippingMethod: 'express_courier',
    tax: 0,
    total: 14400,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'instapay_wallet',
    governorate: 'Cairo',
    trackingNumber: 'BOSTA-EG-772910',
    carrier: 'Bosta Express Egypt',
    estimatedDelivery: 'Delivered',
    adminEmailNotified: true,
    customerEmailNotified: true
  }
];

export const INITIAL_SETTINGS: AdminSettings = {
  adminEmail: 'fiqyyyy@gmail.com',
  storeName: 'DOUÈ Egypt',
  currency: 'EGP',
  smtpConfigured: true,
  senderName: 'DOUÈ Egypt'
};