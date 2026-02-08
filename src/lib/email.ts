import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface OrderDetails {
    orderId: string;
    productTitle: string;
    productPrice: number;
    buyerFee: number;
    sellerFee: number;
    totalPaid: number;
    sellerReceives: number;
    deliveryLocation: string;
    deliveryTime: string;
    agreementTerms: string;
    buyerSignature: string;
    sellerSignature: string;
    createdAt: Date;
    completedAt: Date;
}

interface UserInfo {
    name: string;
    email: string;
}

// Generate HTML invoice
const generateInvoiceHTML = (order: OrderDetails, buyer: UserInfo, seller: UserInfo, isBuyer: boolean) => {
    const date = new Date(order.completedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .invoice-badge { display: inline-block; background: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .row:last-child { border-bottom: none; }
        .label { color: #6b7280; }
        .value { font-weight: 600; color: #1f2937; }
        .total-row { background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 10px; }
        .total-row .value { color: #6366f1; font-size: 20px; }
        .signature-box { background: #fefce8; border: 1px dashed #eab308; border-radius: 8px; padding: 15px; margin-top: 15px; }
        .signature { font-family: 'Brush Script MT', cursive; font-size: 24px; color: #1f2937; }
        .footer { background: #f9fafb; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 12px; }
        .success-icon { font-size: 48px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <h1>Transaction Complete!</h1>
            <p>Order #${order.orderId.slice(-8).toUpperCase()}</p>
        </div>
        
        <div class="content">
            <div class="invoice-badge">${isBuyer ? "PURCHASE RECEIPT" : "SALE RECEIPT"}</div>
            
            <div class="section">
                <div class="section-title">Product Details</div>
                <div class="row">
                    <span class="label">Item</span>
                    <span class="value">${order.productTitle}</span>
                </div>
                <div class="row">
                    <span class="label">Date</span>
                    <span class="value">${date}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Parties</div>
                <div class="row">
                    <span class="label">Seller</span>
                    <span class="value">${seller.name}</span>
                </div>
                <div class="row">
                    <span class="label">Buyer</span>
                    <span class="value">${buyer.name}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Payment Breakdown</div>
                <div class="row">
                    <span class="label">Product Price</span>
                    <span class="value">₹${order.productPrice.toLocaleString()}</span>
                </div>
                ${isBuyer ? `
                <div class="row">
                    <span class="label">Platform Fee (5%)</span>
                    <span class="value">₹${order.buyerFee.toLocaleString()}</span>
                </div>
                <div class="row total-row">
                    <span class="label">Total Paid</span>
                    <span class="value">₹${order.totalPaid.toLocaleString()}</span>
                </div>
                ` : `
                <div class="row">
                    <span class="label">Platform Fee (5%)</span>
                    <span class="value">-₹${order.sellerFee.toLocaleString()}</span>
                </div>
                <div class="row total-row">
                    <span class="label">Amount Received</span>
                    <span class="value">₹${order.sellerReceives.toLocaleString()}</span>
                </div>
                `}
            </div>
            
            <div class="section">
                <div class="section-title">Delivery Details</div>
                <div class="row">
                    <span class="label">Location</span>
                    <span class="value">${order.deliveryLocation}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Digital Signatures</div>
                <div class="signature-box">
                    <p style="margin: 0 0 10px; font-size: 12px; color: #6b7280;">Buyer Signature:</p>
                    <p class="signature">${order.buyerSignature}</p>
                </div>
                <div class="signature-box" style="margin-top: 10px;">
                    <p style="margin: 0 0 10px; font-size: 12px; color: #6b7280;">Seller Signature:</p>
                    <p class="signature">${order.sellerSignature}</p>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an official receipt from CampusMarket.</p>
            <p>For support, contact support@campusmarket.in</p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} CampusMarket. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};

// Generate agreement text for attachment
const generateAgreementText = (order: OrderDetails, buyer: UserInfo, seller: UserInfo) => {
    return `
CAMPUSMARKET PURCHASE AGREEMENT
================================

Order ID: ${order.orderId}
Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}
Completion Date: ${new Date(order.completedAt).toLocaleDateString("en-IN")}

PARTIES:
--------
Seller: ${seller.name} (${seller.email})
Buyer: ${buyer.name} (${buyer.email})

PRODUCT:
--------
Title: ${order.productTitle}
Price: ₹${order.productPrice.toLocaleString()}

PAYMENT DETAILS:
----------------
Product Price: ₹${order.productPrice.toLocaleString()}
Buyer Platform Fee (5%): ₹${order.buyerFee.toLocaleString()}
Seller Platform Fee (5%): ₹${order.sellerFee.toLocaleString()}
Total Paid by Buyer: ₹${order.totalPaid.toLocaleString()}
Amount Received by Seller: ₹${order.sellerReceives.toLocaleString()}

DELIVERY:
---------
Location: ${order.deliveryLocation}
Requested Time: ${order.deliveryTime}

TERMS AND CONDITIONS:
---------------------
${order.agreementTerms}

DIGITAL SIGNATURES:
-------------------
Buyer Signature: ${order.buyerSignature}
Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}

Seller Signature: ${order.sellerSignature}
Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}

STATUS: COMPLETED ✓
-------------------
This transaction has been successfully completed.
The product has been delivered and payment has been released.

---
This is a legally binding agreement generated by CampusMarket.
For disputes, contact support@campusmarket.in
    `.trim();
};

// Send order completion emails
export async function sendOrderCompletionEmails(
    order: OrderDetails,
    buyer: UserInfo,
    seller: UserInfo
) {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log("SMTP not configured, skipping emails");
        return { success: false, message: "SMTP not configured" };
    }

    const agreementText = generateAgreementText(order, buyer, seller);

    try {
        // Send to buyer
        await transporter.sendMail({
            from: `"CampusMarket" <${process.env.SMTP_USER}>`,
            to: buyer.email,
            subject: `✅ Order Complete - ${order.productTitle}`,
            html: generateInvoiceHTML(order, buyer, seller, true),
            attachments: [
                {
                    filename: `Agreement_${order.orderId.slice(-8)}.txt`,
                    content: agreementText,
                },
            ],
        });

        // Send to seller
        await transporter.sendMail({
            from: `"CampusMarket" <${process.env.SMTP_USER}>`,
            to: seller.email,
            subject: `💰 Sale Complete - ${order.productTitle}`,
            html: generateInvoiceHTML(order, buyer, seller, false),
            attachments: [
                {
                    filename: `Agreement_${order.orderId.slice(-8)}.txt`,
                    content: agreementText,
                },
            ],
        });

        console.log(`Emails sent for order ${order.orderId}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending emails:", error);
        return { success: false, error };
    }
}
