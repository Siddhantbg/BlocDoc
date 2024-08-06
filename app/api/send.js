// pages/api/send.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstname, lastname, email, phone, message } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587, // Use the appropriate port for your email service
      secure: false, // Set to true if using port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: 'bloc.doc.alpha@gmail.com',
      subject: 'New Contact Form Submission',
      text: `
        First Name: ${firstname}
        Last Name: ${lastname}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}