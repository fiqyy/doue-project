import nodemailer from 'nodemailer';
import { Order } from '@/types';
import { getAdminSettings, recordEmailNotification } from './db';

// Generate luxury monochrome HTML email template
export async function generateOrderEmailHtml(order: Order, recipientType: 'admin' | 'customer'): Promise<string> {
  const settings = await getAdminSettings();
  const isAdmin = recipientType === 'admin';

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #27272a;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="70" valign="top">
                <img src="${item.image}" alt="${item.name}" width="60" height="75" style="display: block; object-fit: cover; border-radius: 4px; border: 1px solid #3f3f46;" />
              </td>
              <td style="padding-left: 16px;" valign="top">
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #f4f4f5; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${item.name}
                </div>
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #a1a1aa; margin-top: 4px;">
                  Size: ${item.size} &nbsp;|&nbsp; Color: ${item.color} &nbsp;|&nbsp; Qty: ${item.quantity}
                </div>
              </td>
              <td align="right" valign="top" style="font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: 600; color: #f4f4f5;">
                ${(item.price * item.quantity).toLocaleString()} EGP
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isAdmin ? 'New Order Alert' : 'Order Confirmation'} ${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #d4d4d8; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #09090b; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #121215; border: 1px solid #27272a; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 40px 32px 24px 32px; text-align: center; border-bottom: 1px solid #27272a; background: linear-gradient(180deg, #18181b 0%, #121215 100%);">
              <div style="font-family: 'Georgia', serif; font-size: 26px; font-weight: 400; letter-spacing: 0.25em; color: #fafafa; text-transform: uppercase;">
                ${settings.storeName}
              </div>
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; letter-spacing: 0.3em; color: #71717a; text-transform: uppercase; margin-top: 6px;">
                HAUTE COUTURE // ATELIER ACQUISITION
              </div>
            </td>
          </tr>

          <!-- Notification Pill & Message -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              ${isAdmin
      ? `<div style="display: inline-block; padding: 6px 14px; background-color: #27272a; border: 1px solid #3f3f46; border-radius: 20px; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.15em; color: #f4f4f5; text-transform: uppercase;">
                      🚨 ADMIN NOTIFICATION: NEW ATELIER ORDER
                    </div>
                    <h2 style="font-family: 'Georgia', serif; font-size: 22px; font-weight: 400; color: #ffffff; margin: 16px 0 8px 0;">
                      New Order Placed: ${order.total.toLocaleString()} EGP
                    </h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px 0;">
                      A new luxury order has been placed on the storefront. Review order details below or manage this acquisition directly inside the Admin Portal.
                    </p>`
      : `<div style="display: inline-block; padding: 6px 14px; background-color: #27272a; border: 1px solid #3f3f46; border-radius: 20px; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.15em; color: #f4f4f5; text-transform: uppercase;">
                      ACQUISITION CONFIRMED
                    </div>
                    <h2 style="font-family: 'Georgia', serif; font-size: 22px; font-weight: 400; color: #ffffff; margin: 16px 0 8px 0;">
                      Thank you, ${order.customer.firstName}.
                    </h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px 0;">
                      Your atelier garments are now being prepared in our workshop. Each piece undergoes hand inspection before being packaged in archival satin ribbon boxing.
                    </p>`
    }

              <!-- Order Summary Meta Box -->
              <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #18181b; border: 1px solid #27272a; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="border-right: 1px solid #27272a;">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase; color: #71717a; letter-spacing: 0.1em;">Order Reference</div>
                    <div style="font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; color: #f4f4f5; margin-top: 4px;">
                      ${order.orderNumber}
                    </div>
                  </td>
                  <td width="50%">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase; color: #71717a; letter-spacing: 0.1em;">Acquisition Total</div>
                    <div style="font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 4px;">
                      ${order.total.toLocaleString()} EGP
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a; margin-bottom: 8px;">
                ACQUIRED PIECES (${order.items.length})
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Financial Breakdown -->
          <tr>
            <td style="padding: 24px 32px;">
              <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size: 13px; color: #a1a1aa;">
                <tr>
                  <td>Subtotal</td>
                  <td align="right" style="font-family: 'Courier New', monospace; color: #d4d4d8;">${order.subtotal.toLocaleString()} EGP</td>
                </tr>
                ${order.discount > 0
      ? `<tr>
                        <td style="color: #d4d4d8;">VIP Privilege (${order.discountCode || 'PROMO'})</td>
                        <td align="right" style="font-family: 'Courier New', monospace; color: #d4d4d8;">-${order.discount.toLocaleString()} EGP</td>
                      </tr>`
      : ''
    }
                <tr>
                  <td>Insured Express Courier</td>
                  <td align="right" style="font-family: 'Courier New', monospace; color: #d4d4d8;">${order.shippingFee} EGP</td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; font-weight: 700; color: #ffffff; font-size: 15px; border-top: 1px solid #27272a;">TOTAL</td>
                  <td align="right" style="padding-top: 12px; font-family: 'Courier New', monospace; font-size: 16px; font-weight: 700; color: #ffffff; border-top: 1px solid #27272a;">
                    ${order.total.toLocaleString()} EGP
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Details -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 6px; padding: 20px;">
                <div style="font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a; margin-bottom: 10px;">
                  DELIVERY DESTINATION
                </div>
                <div style="font-weight: 600; color: #f4f4f5; font-size: 14px;">
                  ${order.customer.firstName} ${order.customer.lastName}
                </div>
                <div style="font-size: 13px; color: #a1a1aa; margin-top: 4px; line-height: 1.5;">
                  ${order.shippingAddress.address}${order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ''}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                  ${order.shippingAddress.country}<br>
                  <span style="font-family: 'Courier New', monospace; color: #71717a;">${order.customer.email} &bull; ${order.customer.phone}</span>
                </div>
              </div>
            </td>
          </tr>

          <!-- Admin CTA or Customer Status link -->
          <tr>
            <td style="padding: 0 32px 40px 32px; text-align: center;">
              <a href="${isAdmin ? 'http://localhost:3000/admin?order=' + order.orderNumber : 'http://localhost:3000/track?order=' + order.orderNumber}"
                 style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #09090b; font-family: 'Helvetica Neue', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; border-radius: 2px;">
                ${isAdmin ? 'OPEN IN ADMIN PORTAL' : 'TRACK ATELIER SHIPMENT'}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #27272a; text-align: center; background-color: #0e0e10;">
              <div style="font-size: 11px; color: #52525b; line-height: 1.6;">
                ${settings.storeName} &copy; 2026. All rights reserved.<br>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Send or record notifications for both admin and customer
export async function dispatchOrderNotifications(order: Order): Promise<{
  adminSuccess: boolean;
  customerSuccess: boolean;
  adminPreviewUrl?: string;
  error?: string;
}> {
  const settings = await getAdminSettings();
  const adminEmail = settings.adminEmail || 'fiqyyyy@gmail.com';
  const customerEmail = order.customer.email;

  const adminSubject = `[DOUÈ PROJECT] Order Alert: ${order.orderNumber} ($${order.total.toLocaleString()})`;
  const customerSubject = `DOUÈ PROJECT — Acquisition Confirmed #${order.orderNumber}`;

  const adminHtml = await generateOrderEmailHtml(order, 'admin');
  const customerHtml = await generateOrderEmailHtml(order, 'customer');

  let adminPreviewUrl: string | undefined;

  // Attempt real SMTP if configured or environment provided
  const host = process.env.SMTP_HOST || settings.smtpHost;
  const user = process.env.SMTP_USER || settings.smtpUser;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT || settings.smtpPort || 587),
        secure: false,
        auth: { user, pass }
      });

      // Send to Admin
      await transporter.sendMail({
        from: `"${settings.senderName}" <${user}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml
      });

      // Send to Customer
      await transporter.sendMail({
        from: `"${settings.senderName}" <${user}>`,
        to: customerEmail,
        subject: customerSubject,
        html: customerHtml
      });

      // Log both
      await recordEmailNotification({
        orderId: order.id,
        orderNumber: order.orderNumber,
        recipientEmail: adminEmail,
        type: 'admin_new_order',
        subject: adminSubject,
        status: 'sent',
        contentHtml: adminHtml
      });

      await recordEmailNotification({
        orderId: order.id,
        orderNumber: order.orderNumber,
        recipientEmail: customerEmail,
        type: 'customer_confirmation',
        subject: customerSubject,
        status: 'sent',
        contentHtml: customerHtml
      });

      return { adminSuccess: true, customerSuccess: true };
    } catch (err: any) {
      console.warn('Real SMTP delivery failed, falling back to simulated dispatcher:', err.message);
    }
  }

  // Fallback: Simulated notification logger
  try {
    await recordEmailNotification({
      orderId: order.id,
      orderNumber: order.orderNumber,
      recipientEmail: adminEmail,
      type: 'admin_new_order',
      subject: adminSubject,
      status: 'simulated',
      contentHtml: adminHtml
    });

    await recordEmailNotification({
      orderId: order.id,
      orderNumber: order.orderNumber,
      recipientEmail: customerEmail,
      type: 'customer_confirmation',
      subject: customerSubject,
      status: 'simulated',
      contentHtml: customerHtml
    });

    return {
      adminSuccess: true,
      customerSuccess: true,
      adminPreviewUrl
    };
  } catch (err: any) {
    console.error('Failed to dispatch notification:', err);
    return {
      adminSuccess: false,
      customerSuccess: false,
      error: err.message
    };
  }
}