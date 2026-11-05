import { Pool } from 'pg';
import { Product, Order, EmailNotification, AdminSettings, AdminStats, OrderStatus } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from './seed-data';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000 // Prevents hanging on invalid hostnames
});

async function queryDb(queryText: string, params: any[] = []) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is missing.');
  }
  const client = await pool.connect();
  try {
    return await client.query(queryText, params);
  } finally {
    client.release();
  }
}

async function ensureTablesExist() {
  if (!process.env.DATABASE_URL) return;
  try {
    await queryDb(`
      CREATE TABLE IF NOT EXISTS store_store (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL
      );
    `);

    const res = await queryDb('SELECT * FROM store_store WHERE id = 1');
    if (res.rows.length === 0) {
      const initialData = {
        products: INITIAL_PRODUCTS,
        orders: INITIAL_ORDERS,
        emails: [
          {
            id: 'em-001',
            orderId: 'ord-84920',
            orderNumber: 'DOUE-84920',
            recipientEmail: INITIAL_SETTINGS.adminEmail,
            type: 'admin_new_order',
            subject: '[DOUE ATELIER] High-Value Order Alert #DOUE-84920 ($2,717.37)',
            sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            status: 'simulated'
          },
          {
            id: 'em-002',
            orderId: 'ord-84920',
            orderNumber: 'DOUE-84920',
            recipientEmail: INITIAL_SETTINGS.adminEmail,
            type: 'customer_confirmation',
            subject: 'DOUE NOIR — Acquisition Confirmed #DOUE-84920',
            sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            status: 'simulated'
          }
        ],
        settings: INITIAL_SETTINGS
      };
      await queryDb('INSERT INTO store_store (id, data) VALUES (1, $1)', [JSON.stringify(initialData)]);
    }
  } catch (err: any) {
    console.warn('Supabase initialization fallback active during build:', err.message);
  }
}

async function getDbData() {
  if (!process.env.DATABASE_URL) {
    return {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      emails: [],
      settings: INITIAL_SETTINGS
    };
  }

  try {
    await ensureTablesExist();
    const res = await queryDb('SELECT data FROM store_store WHERE id = 1');
    if (res.rows.length > 0) {
      const data = res.rows[0].data;
      if (!data.settings) data.settings = INITIAL_SETTINGS;
      return data;
    }
  } catch (err: any) {
    console.warn('Falling back to seed data:', err.message);
  }

  return {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    emails: [],
    settings: INITIAL_SETTINGS
  };
}

async function saveDbData(data: any) {
  if (!process.env.DATABASE_URL) {
    console.error('SAVE ERROR: DATABASE_URL is missing!');
    return;
  }
  try {
    await ensureTablesExist();
    await queryDb(
      'INSERT INTO store_store (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = $1',
      [JSON.stringify(data)]
    );
    console.log('Successfully saved DB data to Supabase.');
  } catch (err: any) {
    console.error('CRITICAL DB SAVE ERROR:', err.message);
    throw err; // Re-throw so we see it in the API response or logs
  }
}

export async function getProducts(category?: string, search?: string): Promise<Product[]> {
  const db = await getDbData();
  let items: Product[] = db.products || [];

  if (category && category !== 'all') {
    items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && search.trim()) {
    const query = search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.subtitle.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.materials.toLowerCase().includes(query)
    );
  }

  return items;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDbData();
  return (db.products || []).find((p: Product) => p.id === id) || null;
}

export async function saveProduct(productData: Partial<Product> & { name: string; price: number }): Promise<Product> {
  const db = await getDbData();
  if (!db.products) db.products = [];
  const existingIdx = db.products.findIndex((p: Product) => p.id === productData.id);

  let updated: Product;
  if (existingIdx >= 0) {
    updated = {
      ...db.products[existingIdx],
      ...productData
    };
    db.products[existingIdx] = updated;
  } else {
    updated = {
      id: productData.id || `doue-${Date.now().toString(36)}`,
      name: productData.name,
      subtitle: productData.subtitle || 'Atelier Collection Piece',
      price: productData.price,
      originalPrice: productData.originalPrice,
      category: productData.category || 'outerwear',
      description: productData.description || 'Exclusive luxury atelier garment.',
      details: productData.details || ['Hand-finished couture construction', 'Imported luxury fabric'],
      materials: productData.materials || '100% Virgin Wool',
      care: productData.care || 'Specialist dry clean only.',
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85'],
      colors: productData.colors || [{ name: 'Obsidian Black', hex: '#0a0a0a' }],
      sizes: productData.sizes || ['S', 'M', 'L'],
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      stockCount: productData.stockCount !== undefined ? productData.stockCount : 10,
      featured: productData.featured || false,
      badge: productData.badge || 'NEW ARRIVAL',
      threeDType: productData.threeDType || 'blazer'
    };
    db.products.unshift(updated);
  }

  await saveDbData(db);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDbData();
  if (!db.products) return false;
  const initialLen = db.products.length;
  db.products = db.products.filter((p: Product) => p.id !== id);
  if (db.products.length !== initialLen) {
    await saveDbData(db);
    return true;
  }
  return false;
}

export async function getOrders(status?: string, search?: string): Promise<Order[]> {
  const db = await getDbData();
  let orders: Order[] = db.orders || [];

  if (status && status !== 'all') {
    orders = orders.filter((o) => o.status === status);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(q)
    );
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(idOrNumber: string): Promise<Order | null> {
  const db = await getDbData();
  return (
    (db.orders || []).find(
      (o: Order) => o.id === idOrNumber || o.orderNumber.toLowerCase() === idOrNumber.toLowerCase()
    ) || null
  );
}

export async function createOrder(orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> {
  const db = await getDbData();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `DOUE-${randomSuffix}`;
  const id = `ord-${Date.now()}`;

  const newOrder: Order = {
    ...orderInput,
    id,
    orderNumber,
    createdAt: new Date().toISOString()
  };

  if (!db.products) db.products = [];
  for (const item of newOrder.items) {
    const prod = db.products.find((p: Product) => p.id === item.productId);
    if (prod) {
      prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
      if (prod.stockCount === 0) {
        prod.inStock = false;
      }
    }
  }

  if (!db.orders) db.orders = [];
  db.orders.unshift(newOrder);
  await saveDbData(db);
  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  carrier?: string
): Promise<Order | null> {
  const db = await getDbData();
  if (!db.orders) return null;
  const order = db.orders.find((o: Order) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.status = status;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (carrier !== undefined) order.carrier = carrier;

  await saveDbData(db);
  return order;
}

export async function getEmailNotifications(): Promise<EmailNotification[]> {
  const db = await getDbData();
  return (db.emails || []).sort(
    (a: EmailNotification, b: EmailNotification) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
}

export async function recordEmailNotification(
  notification: Omit<EmailNotification, 'id' | 'sentAt'>
): Promise<EmailNotification> {
  const db = await getDbData();
  const record: EmailNotification = {
    ...notification,
    id: `em-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    sentAt: new Date().toISOString()
  };

  if (!db.emails) db.emails = [];
  db.emails.unshift(record);
  await saveDbData(db);
  return record;
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const db = await getDbData();
  return db.settings || INITIAL_SETTINGS;
}

export async function updateAdminSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
  const db = await getDbData();
  db.settings = { ...(db.settings || INITIAL_SETTINGS), ...settings };
  await saveDbData(db);
  return db.settings;
}

export async function getAdminStats(): Promise<AdminStats> {
  const db = await getDbData();
  const orders = db.orders || [];
  const products = db.products || [];

  const totalRevenue = orders
    .filter((o: Order) => o.paymentStatus === 'paid' && o.status !== 'cancelled')
    .reduce((sum: number, o: Order) => sum + o.total, 0);

  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const pendingOrders = orders.filter((o: Order) => o.status === 'pending').length;
  const processingOrders = orders.filter((o: Order) => o.status === 'processing').length;
  const shippedOrders = orders.filter((o: Order) => o.status === 'shipped').length;
  const deliveredOrders = orders.filter((o: Order) => o.status === 'delivered').length;

  const totalProducts = products.length;
  const lowStockCount = products.filter((p: Product) => p.stockCount <= 5).length;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    totalProducts,
    lowStockCount,
    recentOrders: orders.slice(0, 6)
  };
}
