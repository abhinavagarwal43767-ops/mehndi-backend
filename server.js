require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Booking email endpoint
app.post('/send-booking', async (req, res) => {
    const { name, email, phone, service, date, message } = req.body;

    const mailOptions = {
        from: `"Mehndi Booking" <${process.env.SMTP_USER}>`,
        to: process.env.RECEIVER_EMAIL,
        replyTo: email,
        subject: 'New Mehndi Booking Request',
        html: `
<div style="background:#f9f6f2;padding:30px;font-family:'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,0.1)">
    <div style="background:#8e2c2c;color:#fff;padding:20px;text-align:center">
      <h2 style="margin:0;font-size:24px">🌿 Mehndi Booking Request</h2>
    </div>
    <div style="padding:20px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:10px;border-bottom:1px solid #eee"><b>Name</b></td><td style="padding:10px;border-bottom:1px solid #eee">${name}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #eee"><b>Email</b></td><td style="padding:10px;border-bottom:1px solid #eee">${email}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #eee"><b>Phone</b></td><td style="padding:10px;border-bottom:1px solid #eee">${phone}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #eee"><b>Service</b></td><td style="padding:10px;border-bottom:1px solid #eee">${service}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #eee"><b>Event Date</b></td><td style="padding:10px;border-bottom:1px solid #eee">${date}</td></tr>
      </table>
      <div style="margin-top:20px">
        <p style="margin-bottom:5px"><b>Message</b></p>
        <div style="background:#f4f4f4;padding:15px;border-radius:8px">${message}</div>
      </div>
    </div>
    <div style="background:#f1ece7;padding:15px;text-align:center;font-size:12px;color:#777">
      Mehndi Portfolio Booking System
    </div>
  </div>
</div>
`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send email', error: err.message });
    }
});

// OpenAI chat endpoint
// app.post('/chat', async (req, res) => {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ error: 'Message is required' });

//     try {
//         const completion = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: [
//                 { role: 'system', content: 'You are a friendly Mehndi booking assistant.' },
//                 { role: 'user', content: message }
//             ]
//         });

//         const reply = completion.choices?.[0]?.message?.content || 'Sorry, I could not understand.';
//         res.json({ reply });
//     } catch (err) {
//         res.status(500).json({ error: 'OpenAI request failed', details: err.message });
//     }
// });

app.listen(3000, () => console.log('Server running on port 3000'));