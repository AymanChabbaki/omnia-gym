import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: parseInt(process.env.EMAIL_PORT || '587') === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateInvoicePDF = (order, items) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Generating PDF for Order #${order.id}...`);
      const doc = new PDFDocument({ margin: 50 });
      let chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        console.log(`PDF generation finished for Order #${order.id}`);
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', (err) => {
        console.error('PDF Doc Error:', err);
        reject(err);
      });

      // Header
    doc.fillColor('#444444')
       .fontSize(20)
       .text('OMNIA GYM SHOP', 110, 57)
       .fontSize(10)
       .text('123 Gym Street, Casablanca, Morocco', 200, 65, { align: 'right' })
       .text('Phone: +212 600-000000', 200, 80, { align: 'right' })
       .moveDown();

    // Line separator
    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, 100)
       .lineTo(550, 100)
       .stroke();

    // Invoice Info
    doc.fillColor('#444444')
       .fontSize(20)
       .text('INVOICE', 50, 120);

    doc.fontSize(10)
       .text(`Invoice Number: INV-${order.id}`, 50, 150)
       .text(`Invoice Date: ${new Date(order.created_at).toLocaleDateString()}`, 50, 165)
       .text(`Total Amount: ${order.total} DH`, 50, 180)
       .moveDown();

    // Customer Info
    doc.fontSize(12)
       .text('Bill To:', 50, 210, { bold: true })
       .fontSize(10)
       .text(order.full_name, 50, 225)
       .text(order.phone, 50, 240)
       .text(order.address, 50, 255)
       .text(order.city, 50, 270)
       .moveDown();

    // Table Header
    const tableTop = 330;
    doc.fontSize(10)
       .text('Item', 50, tableTop, { bold: true })
       .text('Quantity', 280, tableTop, { width: 90, align: 'right', bold: true })
       .text('Price', 370, tableTop, { width: 90, align: 'right', bold: true })
       .text('Total', 480, tableTop, { width: 70, align: 'right', bold: true });

    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();

    // Table Body
    let position = tableTop + 30;
    items.forEach((item) => {
      doc.fontSize(10)
         .text(`${item.product_name} ${item.flavor ? `(${item.flavor})` : ''}`, 50, position)
         .text(item.quantity.toString(), 280, position, { width: 90, align: 'right' })
         .text(`${item.price} DH`, 370, position, { width: 90, align: 'right' })
         .text(`${(item.price * item.quantity).toFixed(2)} DH`, 480, position, { width: 70, align: 'right' });
      position += 20;
    });

    // Summary
    const summaryTop = position + 30;
    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, summaryTop)
       .lineTo(550, summaryTop)
       .stroke();

    doc.fontSize(10)
       .text('Subtotal:', 370, summaryTop + 10, { width: 90, align: 'right' })
       .text(`${order.subtotal} DH`, 480, summaryTop + 10, { width: 70, align: 'right' })
       .text('Delivery Fee:', 370, summaryTop + 25, { width: 90, align: 'right' })
       .text(`${order.delivery_fee} DH`, 480, summaryTop + 25, { width: 70, align: 'right' })
       .fontSize(12)
       .fillColor('#ff3333')
       .text('Total:', 370, summaryTop + 45, { width: 90, align: 'right', bold: true })
       .text(`${order.total} DH`, 480, summaryTop + 45, { width: 70, align: 'right', bold: true });

    // Footer
    doc.fillColor('#777777')
       .fontSize(10)
       .text('Thank you for your business!', 50, 700, { align: 'center', width: 500 });

    doc.end();
    } catch (err) {
      console.error('PDF Generation Error:', err);
      reject(err);
    }
  });
};

export const sendOrderEmail = async (order, items) => {
  const { id, full_name, address, city, phone, notes, subtotal, delivery_fee, total } = order;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name} ${item.flavor ? `(${item.flavor})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price} DH</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(2)} DH</td>
    </tr>
  `).join('');

  try {
    const pdfBuffer = await generateInvoicePDF(order, items);

    const mailOptions = {
      from: `"Omnia Gym Shop" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received - Order #${id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #ff3333; text-align: center;">New Order Received!</h2>
          <p>A new order has been placed on Omnia Gym Shop. Please find the invoice attached.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; border-bottom: 2px solid #ff3333; padding-bottom: 5px;">Customer Information</h3>
            <p><strong>Name:</strong> ${full_name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Address:</strong> ${address}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>

          <h3 style="border-bottom: 2px solid #ff3333; padding-bottom: 5px;">Order Details (Order #${id})</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #eee;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 10px; text-align: right;">${subtotal} DH</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Delivery Fee:</strong></td>
                <td style="padding: 10px; text-align: right;">${delivery_fee} DH</td>
              </tr>
              <tr style="font-size: 1.2em; color: #ff3333;">
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px; text-align: right;"><strong>${total} DH</strong></td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 30px; text-align: center; font-size: 0.8em; color: #777;">
            <p>Omnia Gym Shop - Internal Notification System</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `invoice_${id}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email with PDF sent for Order #${id}`);
  } catch (error) {
    console.error('Error in email/PDF service:', error);
  }
};
