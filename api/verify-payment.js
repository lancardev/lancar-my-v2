// api/verify-payment.js
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const supaAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const payload = req.body; 
    // ToyyibPay akan POST JSON, cari email dan status
    const email = payload.billEmail || payload.email;
    const status = payload.status_id || payload.status;
    if (status != 1) {
      return res.status(200).json({ ok: false, msg: 'Not paid' });
    }
    // Generate password random 8 chars
    const password = Math.random().toString(36).slice(-8);
    // Create user via Admin API
    const { error: errUser } = await supaAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (errUser) throw errUser;
    // Send password via SendGrid
    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Password Lancar.my Anda',
      text: `Terima kasih kerana mendaftar. Kata laluan anda untuk login:\n\n${password}\n\nSila simpan untuk kegunaan akan datang.`,
    };
    await sgMail.send(msg);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('verify-payment error:', err);
    return res.status(500).json({ error: err.message });
  }
}
