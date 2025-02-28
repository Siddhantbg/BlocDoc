const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(helmet()); 
app.use(bodyParser.json({ limit: '10kb' })); // Limit request body size
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://blocdoc.netlify.app/contact',
  methods: ['POST'],
  credentials: true
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  message: { error: 'Too many requests, please try again later' }
});

// Apply rate limiting to email endpoint
app.use('/send', limiter);

// Input validation middleware
const validateEmailInput = (req, res, next) => {
  const { firstname, lastname, email, message } = req.body;
  
  if (!firstname || !lastname || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};

// Email sending endpoint
app.post('/send', validateEmailInput, async (req, res) => {
  const { firstname, lastname, email, phone, message } = req.body;

  try {
    // Create reusable transporter
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    // Format email with HTML
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`, 
      replyTo: email,
      to: process.env.RECIPIENT_EMAIL || 'bloc.doc.alpha@gmail.com',
      subject: `New Contact: ${firstname} ${lastname}`,
      text: `
        First Name: ${firstname}
        Last Name: ${lastname}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstname} ${lastname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Send email and handle response
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    res.status(200).json({ 
      success: true,
      message: 'Your message has been sent successfully'
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send email. Please try again later.'
    });
  }
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});