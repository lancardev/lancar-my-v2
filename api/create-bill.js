// api/create-bill.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const form = new URLSearchParams({
      userSecretKey: process.env.TOYYIBPAY_SECRET,
      categoryCode:   process.env.TOYYIBPAY_CATEGORY,
      billName:       'Langganan Lancar.my',
      billDescription:'Akses penuh Lancar.my selama 1 bulan',
      billPriceSetting: '1',
      billAmount:      '100',
      billPayorInfo:   '1',
      // ToyyibPay akan gantikan {CUSTOMER_EMAIL}
      billReturnUrl:
        'https://lancar-my-v2.vercel.app/dashboard.html?email={CUSTOMER_EMAIL}',
      billCallbackUrl:
        'https://lancar-my-v2.vercel.app/api/verify-payment'
    });

    const resp = await fetch(
      'https://toyyibpay.com/index.php/api/createBill',
      { method: 'POST', body: form }
    );

    if (!resp.ok) {
      throw new Error(`ToyyibPay createBill failed: ${resp.status}`);
    }

    const [ result ] = await resp.json();
    res.status(200).json({ billCode: result.BillCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
