# Nodemailer Email Blueprint (Express + Vite React)

Reusable setup for sending emails from a Node/Express server using Nodemailer, with a Vite React frontend posting to `/api/*` endpoints.

## 1) Install dependencies

```bash
# Server + utilities
npm i express cors nodemailer dotenv

# Types (optional for TS-aware editors)
npm i -D @types/express @types/cors @types/nodemailer
```

## 2) Server file (`server/index.js`)

- Loads env from `server/env.local` in dev
- Configures SMTP transport (Namecheap or any SMTP)
- Exposes `/api/health` and `/api/contact`

```js
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load local envs if present (dev)
dotenv.config({ path: path.resolve(__dirname, 'env.local') });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function getTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
      // logger: true, debug: true,
    });
  }
  // Dev fallback: Ethereal test inbox
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
    // logger: true, debug: true,
  });
}

function escapeHtml(v) {
  if (v == null) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildContactHtml({ name, email, company, phone, message }) {
  const s = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    company: escapeHtml(company || ''),
    phone: escapeHtml(phone || ''),
    message: escapeHtml(message || ''),
  };
  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>New Contact</title>
  <style>body{font-family:Inter,Segoe UI,Arial,sans-serif;background:#fff;color:#0f172a;margin:0}.wrap{max-width:640px;margin:0 auto;padding:24px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}.hdr{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#00f5ff 0%,#1e90ff 50%,#20b2aa 100%);padding:20px 24px}.hdr h1{margin:0;color:#0b1220;font-size:20px}.content{padding:24px}.grid{display:grid;grid-template-columns:140px 1fr;gap:12px 16px;margin:0 0 16px}.label{color:#0ea5e9;font-weight:600}.msg{background:#f8fafc;border-left:4px solid #1e40af;border-radius:8px;padding:12px 16px;white-space:pre-wrap}.foot{padding:16px 24px;color:#475569;border-top:1px solid #e2e8f0;font-size:12px}</style></head>
  <body><div class="wrap"><div class="card"><div class="hdr"><h1>New Contact Form Submission</h1></div><div class="content"><div class="grid"><div class="label">Name</div><div>${s.name}</div><div class="label">Email</div><div><a href="mailto:${s.email}">${s.email}</a></div>${s.company?`<div class=\"label\">Company</div><div>${s.company}</div>`:''}${s.phone?`<div class=\"label\">Phone</div><div>${s.phone}</div>`:''}</div><div class="msg">${s.message}</div></div><div class="foot">Submitted: ${escapeHtml(new Date().toLocaleString())}</div></div></div></body></html>`;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/contact', async (req, res) => {
  const { name, email, company, message, phone } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ ok: false, error: 'Missing required fields' });
  try {
    const transporter = await getTransporter();
    const html = buildContactHtml({ name, email, company, phone, message });
    const text = [
      'New Contact',
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : undefined,
      phone ? `Phone: ${phone}` : undefined,
      '',
      'Message:',
      message || '',
      '',
      `Submitted: ${new Date().toLocaleString()}`,
    ].filter(Boolean).join('\n');

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@example.com',
      to: process.env.MAIL_TO || process.env.MAIL_FROM || 'no-reply@example.com',
      subject: `New contact from ${name}`,
      text,
      html,
      replyTo: email,
    });

    res.json({ ok: true, previewUrl: nodemailer.getTestMessageUrl?.(info) });
  } catch (e) {
    console.error('sendMail error', e);
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
```

## 3) Dev environment (`server/env.local`)

```ini
PORT=3001
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support@yourdomain.com
SMTP_PASS=your_password
MAIL_FROM=support@yourdomain.com
MAIL_TO=support@yourdomain.com
```

## 4) Vite proxy (dev only)

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } } },
});
```

## 5) Frontend usage

```ts
// src/utils/email.ts
export async function sendContact(data: { name: string; email: string; company?: string; phone?: string; message: string; }) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return false;
  const json = await res.json();
  return Boolean(json?.ok);
}
```

## 6) DNS & SMTP (Namecheap)

- SMTP: host `mail.privateemail.com`, port `587` (STARTTLS) or `465` (SSL), `secure` = false/true respectively, `user` = full email, `pass` = mailbox password
- SPF (TXT on `@`): `v=spf1 include:spf.privateemail.com ~all`
- DKIM (TXT on `default._domainkey`): value from provider (copy from dashboard)
- DMARC (TXT on `_dmarc`): `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com; adkim=s; aspf=s; pct=100`

## 7) Local testing

```bash
npm run server
curl http://localhost:3001/api/health
# Quick POST test
node -e "fetch('http://localhost:3001/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Test',email:'test@example.com',company:'Acme',message:'Hello from dev'})}).then(r=>r.text()).then(console.log)"
```

---

Copy `server/index.js`, set envs, and wire forms to `/api/contact`.
