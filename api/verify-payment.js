// api/verify-payment.js
const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

// Set SendGrid API key dari env var
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Client admin Supabase (Service Role Key)
const supaAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }

  try {
    const { billEmail, status_id } = req.body;
    const email = billEmail || req.body.email;
    const status = status_id || req.body.status;

    // Hanya proceed jika status_id = 1 (approved)
    if (status != 1) {
      return res.status(200).json({ ok: false, msg: 'Payment not approved' });
    }

    // 1) Generate random 8-char password
    const password = Math.random().toString(36).slice(-8);

    // 2) Create Supabase user via Admin API
    const { error: errUser } = await supaAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (errUser) throw errUser;

    // 3) Kirim e-mel kepada user dengan SendGrid
    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL,       // perlu set di Vercel
      subject: 'Kata Laluan Lancar.my Anda',
      text: `Terima kasih kerana mendaftar!\n\nKata laluan anda adalah:\n\n${password}\n\nSila simpan untuk login kemudian.`,
    };
    await sgMail.send(msg);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('verify-payment error:', err);
    return res.status(500).json({ error: err.message });
  }
};
