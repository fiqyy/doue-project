"use strict";(()=>{var e={};e.id=71,e.ids=[71],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},8678:e=>{e.exports=import("pg")},938:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>l,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>u});var i=r(9303),a=r(8716),s=r(670),n=r(2004),d=e([n]);n=(d.then?(await d)():d)[0];let p=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/admin/emails/route",pathname:"/api/admin/emails",filename:"route",bundlePath:"app/api/admin/emails/route"},resolvedPagePath:"D:\\Career\\Prog\\doue project\\src\\app\\api\\admin\\emails\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:m}=p,f="/api/admin/emails/route";function l(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:u})}o()}catch(e){o(e)}})},2004:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{GET:()=>d,POST:()=>l});var i=r(7070),a=r(5748),s=r(471),n=e([a,s]);async function d(){try{let e=await (0,a.l9)();return i.NextResponse.json({success:!0,emails:e,count:e.length})}catch(e){return i.NextResponse.json({success:!1,error:e.message},{status:500})}}async function l(e){try{let{orderId:t,action:r,recipientType:o}=await e.json();if(!t)return i.NextResponse.json({success:!1,error:"Order ID required"},{status:400});let n=await (0,a.HG)(t);if(!n)return i.NextResponse.json({success:!1,error:"Order not found"},{status:404});if("preview"===r){let e=await (0,s.H)(n,o||"admin");return i.NextResponse.json({success:!0,html:e})}if("resend"===r){let e=await (0,s.W)(n);return i.NextResponse.json({success:!0,message:`Notification resent for order ${n.orderNumber}`,result:e})}return i.NextResponse.json({success:!1,error:"Unknown action"},{status:400})}catch(e){return i.NextResponse.json({success:!1,error:e.message},{status:500})}}[a,s]=n.then?(await n)():n,o()}catch(e){o(e)}})},471:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.d(t,{H:()=>n,W:()=>d});var i=r(5245),a=r(5748),s=e([a]);async function n(e,t){let r=await (0,a.BH)(),o="admin"===t,i=e.items.map(e=>`
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
                  <td align="right" style="font-family: 'Courier New', monospace; color: #d4d4d8;">${e.shippingFee} EGP</td>
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
  `}async function d(e){let t;let r=await (0,a.BH)(),o=r.adminEmail||"fiqyyyy@gmail.com",s=e.customer.email,d=`[DOUE PROJECT] Order Alert: ${e.orderNumber} ($${e.total.toLocaleString()})`,l=`DOUE PROJECT — Acquisition Confirmed #${e.orderNumber}`,p=await n(e,"admin"),c=await n(e,"customer"),u=process.env.SMTP_HOST||r.smtpHost,m=process.env.SMTP_USER||r.smtpUser,f=process.env.SMTP_PASS;if(u&&m&&f)try{let t=i.createTransport({host:u,port:Number(process.env.SMTP_PORT||r.smtpPort||587),secure:!1,auth:{user:m,pass:f}});return await t.sendMail({from:`"${r.senderName}" <${m}>`,to:o,subject:d,html:p}),await t.sendMail({from:`"${r.senderName}" <${m}>`,to:s,subject:l,html:c}),await (0,a.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:o,type:"admin_new_order",subject:d,status:"sent",contentHtml:p}),await (0,a.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:s,type:"customer_confirmation",subject:l,status:"sent",contentHtml:c}),{adminSuccess:!0,customerSuccess:!0}}catch(e){console.warn("Real SMTP delivery failed, falling back to simulated dispatcher:",e.message)}try{return await (0,a.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:o,type:"admin_new_order",subject:d,status:"simulated",contentHtml:p}),await (0,a.P6)({orderId:e.id,orderNumber:e.orderNumber,recipientEmail:s,type:"customer_confirmation",subject:l,status:"simulated",contentHtml:c}),{adminSuccess:!0,customerSuccess:!0,adminPreviewUrl:t}}catch(e){return console.error("Failed to dispatch notification:",e),{adminSuccess:!1,customerSuccess:!1,error:e.message}}}a=(s.then?(await s)():s)[0],o()}catch(e){o(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972,245,748],()=>r(938));module.exports=o})();