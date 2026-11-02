"use strict";exports.id=557,exports.ids=[557],exports.modules={5748:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.d(t,{AU:()=>g,BH:()=>E,E7:()=>b,HG:()=>h,Ir:()=>f,JV:()=>S,LV:()=>y,P6:()=>x,Xp:()=>p,Y9:()=>N,gg:()=>m,gk:()=>u,l9:()=>w});var i=r(8678),a=r(2321),s=e([i]);let A=new(i=(s.then?(await s)():s)[0]).Pool({connectionString:process.env.DATABASE_URL,ssl:!!process.env.DATABASE_URL&&{rejectUnauthorized:!1},connectionTimeoutMillis:5e3});async function n(e,t=[]){if(!process.env.DATABASE_URL)throw Error("DATABASE_URL environment variable is missing.");let r=await A.connect();try{return await r.query(e,t)}finally{r.release()}}async function d(){if(process.env.DATABASE_URL)try{await n(`
      CREATE TABLE IF NOT EXISTS store_store (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL
      );
    `);let e=await n("SELECT * FROM store_store WHERE id = 1");if(0===e.rows.length){let e={products:a.SB,orders:a.ri,emails:[{id:"em-001",orderId:"ord-84920",orderNumber:"DOUE-84920",recipientEmail:a.SH.adminEmail,type:"admin_new_order",subject:"[DOUE ATELIER] High-Value Order Alert #DOUE-84920 ($2,717.37)",sentAt:new Date(Date.now()-108e5).toISOString(),status:"simulated"},{id:"em-002",orderId:"ord-84920",orderNumber:"DOUE-84920",recipientEmail:a.SH.adminEmail,type:"customer_confirmation",subject:"DOUE NOIR — Acquisition Confirmed #DOUE-84920",sentAt:new Date(Date.now()-108e5).toISOString(),status:"simulated"}],settings:a.SH};await n("INSERT INTO store_store (id, data) VALUES (1, $1)",[JSON.stringify(e)])}}catch(e){console.warn("Supabase initialization fallback active during build:",e.message)}}async function l(){if(!process.env.DATABASE_URL)return{products:a.SB,orders:a.ri,emails:[],settings:a.SH};try{await d();let e=await n("SELECT data FROM store_store WHERE id = 1");if(e.rows.length>0){let t=e.rows[0].data;return t.settings||(t.settings=a.SH),t}}catch(e){console.warn("Falling back to seed data:",e.message)}return{products:a.SB,orders:a.ri,emails:[],settings:a.SH}}async function c(e){if(!process.env.DATABASE_URL){console.error("SAVE ERROR: DATABASE_URL is missing!");return}try{await d(),await n("INSERT INTO store_store (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = $1",[JSON.stringify(e)]),console.log("Successfully saved DB data to Supabase.")}catch(e){throw console.error("CRITICAL DB SAVE ERROR:",e.message),e}}async function p(e,t){let r=(await l()).products||[];if(e&&"all"!==e&&(r=r.filter(t=>t.category.toLowerCase()===e.toLowerCase())),t&&t.trim()){let e=t.toLowerCase();r=r.filter(t=>t.name.toLowerCase().includes(e)||t.subtitle.toLowerCase().includes(e)||t.category.toLowerCase().includes(e)||t.materials.toLowerCase().includes(e))}return r}async function u(e){return((await l()).products||[]).find(t=>t.id===e)||null}async function m(e){let t;let r=await l();r.products||(r.products=[]);let o=r.products.findIndex(t=>t.id===e.id);return o>=0?(t={...r.products[o],...e},r.products[o]=t):(t={id:e.id||`doue-${Date.now().toString(36)}`,name:e.name,subtitle:e.subtitle||"Atelier Collection Piece",price:e.price,originalPrice:e.originalPrice,category:e.category||"outerwear",description:e.description||"Exclusive luxury atelier garment.",details:e.details||["Hand-finished couture construction","Imported luxury fabric"],materials:e.materials||"100% Virgin Wool",care:e.care||"Specialist dry clean only.",images:e.images&&e.images.length>0?e.images:["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85"],colors:e.colors||[{name:"Obsidian Black",hex:"#0a0a0a"}],sizes:e.sizes||["S","M","L"],inStock:void 0===e.inStock||e.inStock,stockCount:void 0!==e.stockCount?e.stockCount:10,featured:e.featured||!1,badge:e.badge||"NEW ARRIVAL",threeDType:e.threeDType||"blazer"},r.products.unshift(t)),await c(r),t}async function f(e){let t=await l();if(!t.products)return!1;let r=t.products.length;return t.products=t.products.filter(t=>t.id!==e),t.products.length!==r&&(await c(t),!0)}async function g(e,t){let r=(await l()).orders||[];if(e&&"all"!==e&&(r=r.filter(t=>t.status===e)),t&&t.trim()){let e=t.toLowerCase();r=r.filter(t=>t.orderNumber.toLowerCase().includes(e)||t.customer.email.toLowerCase().includes(e)||`${t.customer.firstName} ${t.customer.lastName}`.toLowerCase().includes(e))}return r.sort((e,t)=>new Date(t.createdAt).getTime()-new Date(e.createdAt).getTime())}async function h(e){return((await l()).orders||[]).find(t=>t.id===e||t.orderNumber.toLowerCase()===e.toLowerCase())||null}async function y(e){let t=await l(),r=`DOUE-${Math.floor(1e4+9e4*Math.random())}`,o=`ord-${Date.now()}`,i={...e,id:o,orderNumber:r,createdAt:new Date().toISOString()};for(let e of(t.products||(t.products=[]),i.items)){let r=t.products.find(t=>t.id===e.productId);r&&(r.stockCount=Math.max(0,r.stockCount-e.quantity),0===r.stockCount&&(r.inStock=!1))}return t.orders||(t.orders=[]),t.orders.unshift(i),await c(t),i}async function b(e,t,r,o){let i=await l();if(!i.orders)return null;let a=i.orders.find(t=>t.id===e||t.orderNumber===e);return a?(a.status=t,void 0!==r&&(a.trackingNumber=r),void 0!==o&&(a.carrier=o),await c(i),a):null}async function w(){return((await l()).emails||[]).sort((e,t)=>new Date(t.sentAt).getTime()-new Date(e.sentAt).getTime())}async function x(e){let t=await l(),r={...e,id:`em-${Date.now()}-${Math.random().toString(36).substr(2,4)}`,sentAt:new Date().toISOString()};return t.emails||(t.emails=[]),t.emails.unshift(r),await c(t),r}async function E(){return(await l()).settings||a.SH}async function S(e){let t=await l();return t.settings={...t.settings||a.SH,...e},await c(t),t.settings}async function N(){let e=await l(),t=e.orders||[],r=e.products||[],o=t.filter(e=>"paid"===e.paymentStatus&&"cancelled"!==e.status).reduce((e,t)=>e+t.total,0),i=t.length,a=t.filter(e=>"pending"===e.status).length,s=t.filter(e=>"processing"===e.status).length,n=t.filter(e=>"shipped"===e.status).length,d=t.filter(e=>"delivered"===e.status).length,c=r.length,p=r.filter(e=>e.stockCount<=5).length;return{totalRevenue:Math.round(100*o)/100,totalOrders:i,averageOrderValue:Math.round(100*(i>0?o/i:0))/100,pendingOrders:a,processingOrders:s,shippedOrders:n,deliveredOrders:d,totalProducts:c,lowStockCount:p,recentOrders:t.slice(0,6)}}o()}catch(e){o(e)}})},471:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.d(t,{H:()=>n,W:()=>d});var i=r(5245),a=r(5748),s=e([a]);async function n(e,t){let r=await (0,a.BH)(),o="admin"===t,i=e.items.map(e=>`
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
  <title>${o?"New Order Alert":"Order Confirmation"} ${e.orderNumber}</title>
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
                ${i}
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
  `}async function d(e){let t;let r=await (0,a.BH)(),o=r.adminEmail||"fiqyyyy@gmail.com",s=e.customer.email,d=`[DOUE ATELIER] Order Alert: ${e.orderNumber} ($${e.total.toLocaleString()})`,l=`DOUE NOIR — Acquisition Confirmed #${e.orderNumber}`,c=await n(e,"admin"),p=await n(e,"customer"),u=process.env.SMTP_HOST||r.smtpHost,m=process.env.SMTP_USER||r.smtpUser,f=process.env.SMTP_PASS;if(u&&m&&f)try{let t=i.createTransport({host:u,port:Number(process.env.SMTP_PORT||r.smtpPort||587),secure:!1,auth:{user:m,pass:f}});return await t.sendMail({from:`"${r.senderName}" <${m}>`,to:o,subject:d,html:c}),await t.sendMail({from:`"${r.senderName}" <${m}>`,to:s,subject:l,html:p}),await (0,a.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:o,type:"admin_new_order",subject:d,status:"sent",contentHtml:c}),await (0,a.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:s,type:"customer_confirmation",subject:l,status:"sent",contentHtml:p}),{adminSuccess:!0,customerSuccess:!0}}catch(e){console.warn("Real SMTP delivery failed, falling back to simulated dispatcher:",e.message)}try{return await (0,a.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:o,type:"admin_new_order",subject:d,status:"simulated",contentHtml:c}),await (0,a.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:s,type:"customer_confirmation",subject:l,status:"simulated",contentHtml:p}),{adminSuccess:!0,customerSuccess:!0,adminPreviewUrl:t}}catch(e){return console.error("Failed to dispatch notification:",e),{adminSuccess:!1,customerSuccess:!1,error:e.message}}}a=(s.then?(await s)():s)[0],o()}catch(e){o(e)}})},2321:(e,t,r)=>{r.d(t,{SB:()=>o,SH:()=>a,ri:()=>i});let o=[{id:"doue-001",name:"Atelier Cashmere Overcoat",subtitle:"Double-Faced Wool & Mongolian Cashmere / Noir & Brown",price:5850,originalPrice:6500,category:"outerwear",description:"Sculptural trench overcoat hand-tailored from double-faced virgin wool and cashmere blend. Features an unlined architectural drop-shoulder cut, pick lapels, matte horn buttons, and deep storm flaps with concealed brushed titanium clasps.",details:["Double-Faced Wool & Cashmere blend (680gsm)","Unstructured architectural drop-shoulder cut","Matte black buffalo horn buttons","Interior breast pocket with laser-etched serial plate","Handcrafted in Cairo Boutique Atelier"],materials:"80% Virgin Wool, 20% Mongolian Cashmere; Cupro lining in sleeves",care:"Specialist luxury dry clean only. Store on wooden atelier hanger.",images:["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"],colors:[{name:"Obsidian Black",hex:"#0a0a0a"},{name:"Rich Brown",hex:"#3d2817"}],sizes:["46 / S","48 / M","50 / L","52 / XL"],inStock:!0,stockCount:12,featured:!0,badge:"COLLECTION SS26",modelDetails:"Model is 185cm wearing size 48 / M",threeDType:"coat"}],i=[{id:"ord-84920",orderNumber:"DOUE-84920",createdAt:new Date(Date.now()-108e5).toISOString(),customer:{firstName:"Kareem",lastName:"El-Sayed",email:"kareem.elsayed@gmail.com",phone:"01012345678"},shippingAddress:{address:"South 90th Street, Fifth Settlement (Tagamoa)",apartment:"Villa 14",city:"New Cairo",state:"Cairo",postalCode:"11835",country:"Egypt"},items:[{productId:"doue-001",name:"Atelier Cashmere Overcoat",price:5850,image:"https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85",size:"50 / L",color:"Obsidian Black",quantity:1}],subtotal:5850,discount:585,discountCode:"DOUEVIP10",shippingFee:45,shippingMethod:"express_courier",tax:468,total:5733,status:"processing",paymentStatus:"pending",paymentMethod:"cod",governorate:"Cairo",trackingNumber:"BOSTA-EG-998214",carrier:"Bosta Express Egypt",estimatedDelivery:"Tomorrow (24-48 hrs)",notes:"Please call client before delivery. Inspection on delivery allowed.",adminEmailNotified:!0,customerEmailNotified:!0,giftPackaging:!0}],a={adminEmail:"fiqyyyy@gmail.com",storeName:"DOUE Egypt",currency:"EGP",smtpConfigured:!0,senderName:"DOUE Egypt Atelier"}}};