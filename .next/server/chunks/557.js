"use strict";exports.id=557,exports.ids=[557],exports.modules={1270:(e,t,r)=>{r.d(t,{LV:()=>w,Ir:()=>b,BH:()=>C,Y9:()=>O,l9:()=>S,HG:()=>x,AU:()=>y,gk:()=>g,Xp:()=>f,P6:()=>v,gg:()=>h,JV:()=>E,E7:()=>N});var o=r(2048),i=r.n(o),a=r(5315),n=r.n(a);let s=[{id:"doue-001",name:"Atelier Cashmere Overcoat",subtitle:"Double-Faced Wool & Mongolian Cashmere / Noir & Brown",price:5850,originalPrice:6500,category:"outerwear",description:"Sculptural trench overcoat hand-tailored from double-faced virgin wool and cashmere blend. Features an unlined architectural drop-shoulder cut, pick lapels, matte horn buttons, and deep storm flaps with concealed brushed titanium clasps.",details:["Double-Faced Wool & Cashmere blend (680gsm)","Unstructured architectural drop-shoulder cut","Matte black buffalo horn buttons","Interior breast pocket with laser-etched serial plate","Handcrafted in Cairo Boutique Atelier"],materials:"80% Virgin Wool, 20% Mongolian Cashmere; Cupro lining in sleeves",care:"Specialist luxury dry clean only. Store on wooden atelier hanger.",images:["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"],colors:[{name:"Obsidian Black",hex:"#0a0a0a"},{name:"Rich Brown",hex:"#3d2817"}],sizes:["46 / S","48 / M","50 / L","52 / XL"],inStock:!0,stockCount:12,featured:!0,badge:"COLLECTION SS26",modelDetails:"Model is 185cm wearing size 48 / M",threeDType:"coat"}],l=[{id:"ord-84920",orderNumber:"DOUE-84920",createdAt:new Date(Date.now()-108e5).toISOString(),customer:{firstName:"Kareem",lastName:"El-Sayed",email:"kareem.elsayed@gmail.com",phone:"01012345678"},shippingAddress:{address:"South 90th Street, Fifth Settlement (Tagamoa)",apartment:"Villa 14",city:"New Cairo",state:"Cairo",postalCode:"11835",country:"Egypt"},items:[{productId:"doue-001",name:"Atelier Cashmere Overcoat",price:5850,image:"https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85",size:"50 / L",color:"Obsidian Black",quantity:1}],subtotal:5850,discount:585,discountCode:"DOUEVIP10",shippingFee:45,shippingMethod:"express_courier",tax:468,total:5733,status:"processing",paymentStatus:"pending",paymentMethod:"cod",governorate:"Cairo",trackingNumber:"BOSTA-EG-998214",carrier:"Bosta Express Egypt",estimatedDelivery:"Tomorrow (24-48 hrs)",notes:"Please call client before delivery. Inspection on delivery allowed.",adminEmailNotified:!0,customerEmailNotified:!0,giftPackaging:!0}],d={adminEmail:"fiqyyyy@gmail.com",storeName:"DOUE Egypt",currency:"EGP",smtpConfigured:!0,senderName:"DOUE Egypt Atelier"},c=n().join(process.cwd(),"data"),p=n().join(c,"doue-store.json");function u(){if(i().existsSync(c)||i().mkdirSync(c,{recursive:!0}),!i().existsSync(p)){let e={products:s,orders:l,emails:[{id:"em-001",orderId:"ord-84920",orderNumber:"DOUE-84920",recipientEmail:d.adminEmail,type:"admin_new_order",subject:"[DOUE ATELIER] High-Value Order Alert #DOUE-84920 ($2,717.37)",sentAt:new Date(Date.now()-108e5).toISOString(),status:"simulated"},{id:"em-002",orderId:"ord-84920",orderNumber:"DOUE-84920",recipientEmail:d.adminEmail,type:"customer_confirmation",subject:"DOUE NOIR — Acquisition Confirmed #DOUE-84920",sentAt:new Date(Date.now()-108e5).toISOString(),status:"simulated"}],settings:d};return i().writeFileSync(p,JSON.stringify(e,null,2),"utf-8"),e}try{let e=i().readFileSync(p,"utf-8");return JSON.parse(e)}catch(t){console.error("Error reading DB, restoring fallback:",t);let e={products:s,orders:l,emails:[],settings:d};return i().writeFileSync(p,JSON.stringify(e,null,2),"utf-8"),e}}function m(e){u();let t=`${p}.tmp`;i().writeFileSync(t,JSON.stringify(e,null,2),"utf-8"),i().renameSync(t,p)}function f(e,t){let r=u().products;if(e&&"all"!==e&&(r=r.filter(t=>t.category.toLowerCase()===e.toLowerCase())),t&&t.trim()){let e=t.toLowerCase();r=r.filter(t=>t.name.toLowerCase().includes(e)||t.subtitle.toLowerCase().includes(e)||t.category.toLowerCase().includes(e)||t.materials.toLowerCase().includes(e))}return r}function g(e){return u().products.find(t=>t.id===e)||null}function h(e){let t=u(),r=t.products.findIndex(t=>t.id===e.id);if(r>=0){let o={...t.products[r],...e};return t.products[r]=o,m(t),o}{let r={id:e.id||`doue-${Date.now().toString(36)}`,name:e.name,subtitle:e.subtitle||"Atelier Collection Piece",price:e.price,originalPrice:e.originalPrice,category:e.category||"outerwear",description:e.description||"Exclusive luxury atelier garment.",details:e.details||["Hand-finished couture construction","Imported luxury fabric"],materials:e.materials||"100% Virgin Wool",care:e.care||"Specialist dry clean only.",images:e.images&&e.images.length>0?e.images:["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85"],colors:e.colors||[{name:"Obsidian Black",hex:"#0a0a0a"}],sizes:e.sizes||["S","M","L"],inStock:void 0===e.inStock||e.inStock,stockCount:void 0!==e.stockCount?e.stockCount:10,featured:e.featured||!1,badge:e.badge||"NEW ARRIVAL",threeDType:e.threeDType||"blazer"};return t.products.unshift(r),m(t),r}}function b(e){let t=u(),r=t.products.length;return t.products=t.products.filter(t=>t.id!==e),t.products.length!==r&&(m(t),!0)}function y(e,t){let r=u().orders;if(e&&"all"!==e&&(r=r.filter(t=>t.status===e)),t&&t.trim()){let e=t.toLowerCase();r=r.filter(t=>t.orderNumber.toLowerCase().includes(e)||t.customer.email.toLowerCase().includes(e)||`${t.customer.firstName} ${t.customer.lastName}`.toLowerCase().includes(e))}return r.sort((e,t)=>new Date(t.createdAt).getTime()-new Date(e.createdAt).getTime())}function x(e){return u().orders.find(t=>t.id===e||t.orderNumber.toLowerCase()===e.toLowerCase())||null}function w(e){let t=u(),r=`DOUE-${Math.floor(1e4+9e4*Math.random())}`,o=`ord-${Date.now()}`,i={...e,id:o,orderNumber:r,createdAt:new Date().toISOString()};for(let e of i.items){let r=t.products.find(t=>t.id===e.productId);r&&(r.stockCount=Math.max(0,r.stockCount-e.quantity),0===r.stockCount&&(r.inStock=!1))}return t.orders.unshift(i),m(t),i}function N(e,t,r,o){let i=u(),a=i.orders.find(t=>t.id===e||t.orderNumber===e);return a?(a.status=t,void 0!==r&&(a.trackingNumber=r),void 0!==o&&(a.carrier=o),m(i),a):null}function S(){return(u().emails||[]).sort((e,t)=>new Date(t.sentAt).getTime()-new Date(e.sentAt).getTime())}function v(e){let t=u(),r={...e,id:`em-${Date.now()}-${Math.random().toString(36).substr(2,4)}`,sentAt:new Date().toISOString()};return t.emails||(t.emails=[]),t.emails.unshift(r),m(t),r}function C(){return u().settings||d}function E(e){let t=u();return t.settings={...t.settings,...e},m(t),t.settings}function O(){let e=u(),t=e.orders,r=t.filter(e=>"paid"===e.paymentStatus&&"cancelled"!==e.status).reduce((e,t)=>e+t.total,0),o=t.length,i=t.filter(e=>"pending"===e.status).length,a=t.filter(e=>"processing"===e.status).length,n=t.filter(e=>"shipped"===e.status).length;return{totalRevenue:Math.round(100*r)/100,totalOrders:o,averageOrderValue:Math.round(100*(o>0?r/o:0))/100,pendingOrders:i,processingOrders:a,shippedOrders:n,deliveredOrders:t.filter(e=>"delivered"===e.status).length,totalProducts:e.products.length,lowStockCount:e.products.filter(e=>e.stockCount<=5).length,recentOrders:t.slice(0,6)}}},471:(e,t,r)=>{r.d(t,{H:()=>a,W:()=>n});var o=r(5245),i=r(1270);function a(e,t){let r=(0,i.BH)(),o="admin"===t,a=e.items.map(e=>`
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #27272a;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="70" valign="top">
                <img src="${e.image}" alt="${e.name}" width="60" height="75" style="display: block; object-fit: cover; border-radius: 4px; border: 1px solid #3f3f46;" />
              </td>
              <td style="padding-left: 16px;" valign="top">
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #f4f4f5; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${e.name}
                </div>
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #a1a1aa; margin-top: 4px;">
                  Size: ${e.size} &nbsp;|&nbsp; Color: ${e.color} &nbsp;|&nbsp; Qty: ${e.quantity}
                </div>
              </td>
              <td align="right" valign="top" style="font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: 600; color: #f4f4f5;">
                ${(e.price*e.quantity).toLocaleString()} EGP
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join("");return`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${o?"New Order Alert":"Order Confirmation"} - ${e.orderNumber}</title>
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
                ${r.storeName}
              </div>
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; letter-spacing: 0.3em; color: #71717a; text-transform: uppercase; margin-top: 6px;">
                HAUTE COUTURE // ATELIER ACQUISITION
              </div>
            </td>
          </tr>

          <!-- Notification Pill & Message -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              ${o?`<div style="display: inline-block; padding: 6px 14px; background-color: #27272a; border: 1px solid #3f3f46; border-radius: 20px; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.15em; color: #f4f4f5; text-transform: uppercase;">
                      🚨 ADMIN NOTIFICATION: NEW ATELIER ORDER
                    </div>
                    <h2 style="font-family: 'Georgia', serif; font-size: 22px; font-weight: 400; color: #ffffff; margin: 16px 0 8px 0;">
                      New Order Placed: ${e.total.toLocaleString()} EGP
                    </h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px 0;">
                      A new luxury order has been placed on the storefront. Review order details below or manage this acquisition directly inside the Admin Portal.
                    </p>`:`<div style="display: inline-block; padding: 6px 14px; background-color: #27272a; border: 1px solid #3f3f46; border-radius: 20px; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.15em; color: #f4f4f5; text-transform: uppercase;">
                      ACQUISITION CONFIRMED
                    </div>
                    <h2 style="font-family: 'Georgia', serif; font-size: 22px; font-weight: 400; color: #ffffff; margin: 16px 0 8px 0;">
                      Thank you, ${e.customer.firstName}.
                    </h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px 0;">
                      Your atelier garments are now being prepared in our workshop. Each piece undergoes hand inspection before being packaged in archival satin ribbon boxing.
                    </p>`}

              <!-- Order Summary Meta Box -->
              <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #18181b; border: 1px solid #27272a; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="border-right: 1px solid #27272a;">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase; color: #71717a; letter-spacing: 0.1em;">Order Reference</div>
                    <div style="font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; color: #f4f4f5; margin-top: 4px;">
                      ${e.orderNumber}
                    </div>
                  </td>
                  <td width="50%">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase; color: #71717a; letter-spacing: 0.1em;">Acquisition Total</div>
                    <div style="font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 4px;">
                      ${e.total.toLocaleString()} EGP
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
                ACQUIRED PIECES (${e.items.length})
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${a}
              </table>
            </td>
          </tr>

          <!-- Financial Breakdown -->
          <tr>
            <td style="padding: 24px 32px;">
              <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size: 13px; color: #a1a1aa;">
                <tr>
                  <td>Subtotal</td>
                  <td align="right" style="font-family: 'Courier New', monospace; color: #d4d4d8;">${e.subtotal.toLocaleString()} EGP</td>
                </tr>
                ${e.discount>0?`<tr>
                        <td style="color: #d4d4d8;">VIP Privilege (${e.discountCode||"PROMO"})</td>
                        <td align="right" style="font-family: 'Courier New', monospace; color: #d4d4d8;">-${e.discount.toLocaleString()} EGP</td>
                      </tr>`:""}
                <tr>
                  <td>Insured Express Courier</td>
                  <td align="right" style="font-family: 'Courier New', monospace; color: #d4d4d8;">${0===e.shippingFee?"COMPLIMENTARY":`${e.shippingFee} EGP`}</td>
                </tr>
                <tr>
                  <td>Import Duties & Atelier Tax</td>
                  <td align="right" style="font-family: 'Courier New', monospace; color: #d4d4d8;">${e.tax.toLocaleString()} EGP</td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; font-weight: 700; color: #ffffff; font-size: 15px; border-top: 1px solid #27272a;">TOTAL</td>
                  <td align="right" style="padding-top: 12px; font-family: 'Courier New', monospace; font-size: 16px; font-weight: 700; color: #ffffff; border-top: 1px solid #27272a;">
                    ${e.total.toLocaleString()} EGP
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
                  ${e.customer.firstName} ${e.customer.lastName}
                </div>
                <div style="font-size: 13px; color: #a1a1aa; margin-top: 4px; line-height: 1.5;">
                  ${e.shippingAddress.address}${e.shippingAddress.apartment?`, ${e.shippingAddress.apartment}`:""}<br>
                  ${e.shippingAddress.city}, ${e.shippingAddress.postalCode}<br>
                  ${e.shippingAddress.country}<br>
                  <span style="font-family: 'Courier New', monospace; color: #71717a;">${e.customer.email} &bull; ${e.customer.phone}</span>
                </div>

              </div>
            </td>
          </tr>

          <!-- Admin CTA or Customer Status link -->
          <tr>
            <td style="padding: 0 32px 40px 32px; text-align: center;">
              <a href="${o?"http://localhost:3000/admin?order="+e.orderNumber:"http://localhost:3000/track?order="+e.orderNumber}"
                 style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #09090b; font-family: 'Helvetica Neue', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; border-radius: 2px;">
                ${o?"OPEN IN ADMIN PORTAL":"TRACK ATELIER SHIPMENT"}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #27272a; text-align: center; background-color: #0e0e10;">
              <div style="font-size: 11px; color: #52525b; line-height: 1.6;">
                ${r.storeName} &copy; 2026. All rights reserved.<br>
                Milan &bull; Paris &bull; Tokyo &bull; New York
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `}async function n(e){let t;let r=(0,i.BH)(),n=r.adminEmail||"fiqyyyy@gmail.com",s=e.customer.email,l=`[DOUE ATELIER] Order Alert: ${e.orderNumber} ($${e.total.toLocaleString()})`,d=`DOUE NOIR — Acquisition Confirmed #${e.orderNumber}`,c=a(e,"admin"),p=a(e,"customer"),u=process.env.SMTP_HOST||r.smtpHost,m=process.env.SMTP_USER||r.smtpUser,f=process.env.SMTP_PASS;if(u&&m&&f)try{let t=o.createTransport({host:u,port:Number(process.env.SMTP_PORT||r.smtpPort||587),secure:!1,auth:{user:m,pass:f}});return await t.sendMail({from:`"${r.senderName}" <${m}>`,to:n,subject:l,html:c}),await t.sendMail({from:`"${r.senderName}" <${m}>`,to:s,subject:d,html:p}),(0,i.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:n,type:"admin_new_order",subject:l,status:"sent",contentHtml:c}),(0,i.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:s,type:"customer_confirmation",subject:d,status:"sent",contentHtml:p}),{adminSuccess:!0,customerSuccess:!0}}catch(e){console.warn("Real SMTP delivery failed, falling back to instant simulated dispatcher:",e.message)}try{return(0,i.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:n,type:"admin_new_order",subject:l,status:"simulated",contentHtml:c}),(0,i.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:s,type:"customer_confirmation",subject:d,status:"simulated",contentHtml:p}),{adminSuccess:!0,customerSuccess:!0,adminPreviewUrl:t}}catch(e){return console.error("Failed to dispatch notification:",e),{adminSuccess:!1,customerSuccess:!1,error:e.message}}}}};