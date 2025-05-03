// api/create-bill.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    try {
      // Bangun body x-www-form-urlencoded
      const form = new URLSearchParams({
        userSecretKey: process.env.TOYYIBPAY_SECRET,
        categoryCode:   process.env.TOYYIBPAY_CATEGORY,
        billName:       'Langganan Lancar.my',
        billDescription:'Akses penuh Lancar.my selama 1 bulan',
        billPriceSetting: '1',
        billAmount:      '100',
        billPayorInfo:   '1',
        billReturnUrl:
          'https://lancar-my-v2.vercel.app/dashboard.html?email={CUSTOMER_EMAIL}',
        billCallbackUrl:
          'https://lancar-my-v2.vercel.app/api/verify-payment'
      });
  
      // Panggil ToyyibPay API dengan global fetch
      const resp = await fetch(
        'https://toyyibpay.com/index.php/api/createBill',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: form
        }
      );
  
      if (!resp.ok) {
        throw new Error(`ToyyibPay API returned ${resp.status}`);
      }
  
      const [ result ] = await resp.json();
      return res.status(200).json({ billCode: result.BillCode });
    } catch (err) {
      console.error('create-bill error:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  