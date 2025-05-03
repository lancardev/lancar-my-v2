// api/create-bill.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    try {
      // Build x-www-form-urlencoded body
      const form = new URLSearchParams({
        userSecretKey:  process.env.TOYYIBPAY_SECRET,
        categoryCode:    process.env.TOYYIBPAY_CATEGORY,
        billName:        'Langganan Lancar.my',
        billDescription: 'Akses penuh Lancar.my selama 1 bulan',
        billPriceSetting:'1',
        billAmount:      '100',                     // RM1.00 → 100 sen
        billPayorInfo:   '1',                       // minta info payor
        billTo:          '{CUSTOMER_EMAIL}',        // placeholder nama
        billEmail:       '{CUSTOMER_EMAIL}',        // placeholder e-mel
        billReturnUrl:
          'https://lancar-my-v2.vercel.app/dashboard.html?email={CUSTOMER_EMAIL}',
        billCallbackUrl:
          'https://lancar-my-v2.vercel.app/api/verify-payment'
      });
  
      const resp = await fetch(
        'https://toyyibpay.com/index.php/api/createBill',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form
        }
      );
  
      if (!resp.ok) {
        throw new Error(`ToyyibPay API returned status ${resp.status}`);
      }
  
      const json = await resp.json();
      let billCode;
  
      if (Array.isArray(json) && json.length > 0 && json[0].BillCode) {
        billCode = json[0].BillCode;
      } else if (json.BillCode) {
        billCode = json.BillCode;
      } else if (json.error) {
        throw new Error(json.error);
      } else {
        throw new Error(`Unexpected response: ${JSON.stringify(json)}`);
      }
  
      return res.status(200).json({ billCode });
  
    } catch (err) {
      console.error('create-bill error:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  