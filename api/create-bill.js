// api/create-bill.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    try {
      const { email } = req.body;
      if (
        typeof email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        throw new Error('Format e-mel tidak sah');
      }
  
      // BASE_URL dari env atau fallback
      const BASE_URL = process.env.BASE_URL
        || 'https://lancar-my-v2.vercel.app';
  
      // Hanya invoice terbuka, tak collect apa-apa payor info
      const form = new URLSearchParams({
        userSecretKey:    process.env.TOYYIBPAY_SECRET,
        categoryCode:     process.env.TOYYIBPAY_CATEGORY,
        billName:         'Langganan Lancar.my',
        billDescription:  'Akses penuh Lancar.my selama 1 bulan',
        billPriceSetting: '1',      // fixed amount
        billAmount:       '100',    // RM1.00 = 100 sen
        billPayorInfo:    '0',      // NO payor info
        billReturnUrl:    `${BASE_URL}/dashboard.html?email=${encodeURIComponent(email)}`,
        billCallbackUrl:  `${BASE_URL}/api/verify-payment`
      });
  
      // Panggil DEV endpoint
      const resp = await fetch(
        'https://dev.toyyibpay.com/index.php/api/createBill',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form
        }
      );
  
      const text = await resp.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response: ${text}`);
      }
  
      if (json.status === 'error' || json.error) {
        const msg = json.msg || json.error || JSON.stringify(json);
        throw new Error(msg);
      }
  
      const billCode = Array.isArray(json)
        ? json[0]?.BillCode
        : json.BillCode;
      if (!billCode) {
        throw new Error('Tiada BillCode dalam response');
      }
  
      return res.status(200).json({ billCode });
  
    } catch (err) {
      console.error('create-bill error:', err);
      return res.status(400).json({ error: err.message });
    }
  }
  