const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Simple in-memory storage for messages (in a real app, you would use a database)
const messages = [];

// API endpoint to handle contact form submissions
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Store the message (in a real app, you would save to a database)
    messages.push({
      id: Date.now(),
      name,
      email,
      message,
      date: new Date()
    });
    
    // In a real application, you would send an email here
    // Example with nodemailer (commented out since it needs real credentials)
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password-or-app-password'
      }
    });
    
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'recipient@example.com',
      subject: `New contact from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };
    
    transporter.sendMail(mailOptions);
    */
    
    return res.status(200).json({ 
      success: true, 
      message: 'Your message has been received successfully!' 
    });
  } catch (error) {
    console.error('Error in contact submission:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'There was a problem submitting your message. Please try again later.' 
    });
  }
});

// For production, serve static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 