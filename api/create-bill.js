// api/create-bill.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    try {
      const { email } = req.body;
      // Validasi ringkas format e-m
      if (
        typeof email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        throw new Error('Format e-mel tidak sah');
      }
  
      // Build x-www-form-urlencoded body
      const form = new URLSearchParams({
        userSecretKey:   process.env.TOYYIBPAY_SECRET,
        categoryCode:    process.env.TOYYIBPAY_CATEGORY,
        billName:        'Langganan Lancar.my',
        billDescription: 'Akses penuh Lancar.my selama 1 bulan',
        billPriceSetting:'1',
        billAmount:      '100',           // RM1.00 → 100 sen
        billPayorInfo:   '1',             // minta e-mel
        billTo:          email,           // nama akan jadi e-mel pelanggan (boleh ubah jika mahu)
        billEmail:       email,           // e-mel pelanggan
        billReturnUrl:
          `https://lancar-my-v2.vercel.app/dashboard.html?email=${encodeURIComponent(email)}`,
        billCallbackUrl:
          'https://lancar-my-v2.vercel.app/api/verify-payment'
      });
  
      // Panggil ToyyibPay API
      const resp = await fetch(
        'https://toyyibpay.com/index.php/api/createBill',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form
        }
      );
      if (!resp.ok) {
        throw new Error(`ToyyibPay API returned ${resp.status}`);
      }
  
      const json = await resp.json();
      // Ekstrak BillCode
      const billCode = Array.isArray(json)
        ? json[0]?.BillCode
        : json.BillCode;
      if (!billCode) {
        throw new Error(json.error || `Unexpected response: ${JSON.stringify(json)}`);
      }
  
      return res.status(200).json({ billCode });
    } catch (err) {
      console.error('create-bill error:', err);
      return res.status(400).json({ error: err.message });
    }
  }
  