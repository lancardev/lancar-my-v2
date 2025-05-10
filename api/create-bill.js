// api/create-bill.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', ['POST']).end();
  }
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Format e-mel tidak sah');
    }
    const BASE = process.env.BASE_URL || 'https://lancar-my-v2.vercel.app';
    const form = new URLSearchParams({
      userSecretKey:   process.env.TOYYIBPAY_SECRET,
      categoryCode:    process.env.TOYYIBPAY_CATEGORY,
      billName:        'Langganan Lancar.my',
      billDescription: 'Akses penuh Lancar.my selama 1 bulan',
      billPriceSetting:'1',
      billAmount:      '100',
      billPayorInfo:   '0',
      // ← setelah bayar, redirect ke login.html
      billReturnUrl:   `${BASE}/login.html?email=${encodeURIComponent(email)}`,
      billCallbackUrl: `${BASE}/api/verify-payment`
    });
    const resp = await fetch(
      'https://dev.toyyibpay.com/index.php/api/createBill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form
      }
    );
    const text = await resp.text();
    const json = JSON.parse(text);
    if (json.status==='error' || json.error) {
      throw new Error(json.msg||json.error);
    }
    const billCode = Array.isArray(json) ? json[0]?.BillCode : json.BillCode;
    if (!billCode) throw new Error('Tiada BillCode dalam response');
    return res.status(200).json({ billCode });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}
