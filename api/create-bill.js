// api/create-bill.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow',['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const { email } = req.body;
    if (!email) throw new Error('Tiada email');

    const BASE_URL = process.env.BASE_URL;  // contoh: https://lancar-my-v2.vercel.app

    const form = new URLSearchParams({
      userSecretKey:   process.env.TOYYIBPAY_SECRET,
      categoryCode:    process.env.TOYYIBPAY_CATEGORY,
      billName:        'Langganan Lancar.my',
      billDescription: 'Akses penuh Lancar.my selama 1 bulan',
      billPriceSetting:'1',
      billAmount:      '100',
      billPayorInfo:   '0',
      billReturnUrl:   `${BASE_URL}/dashboard.html`,       // **terus ke dashboard**
      billCallbackUrl: `${BASE_URL}/api/verify-payment`
    });

    const resp = await fetch(
      'https://dev.toyyibpay.com/index.php/api/createBill',
      { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body:form }
    );
    const text = await resp.text();
    let json;
    try { json = JSON.parse(text); }
    catch { throw new Error(`Unexpected response: ${text}`); }

    const billCode = Array.isArray(json)? json[0]?.BillCode : json.BillCode;
    if (!billCode) throw new Error('Tiada BillCode dalam response');

    res.status(200).json({ billCode });
  } catch(err) {
    console.error('create-bill error:', err);
    res.status(400).json({ error: err.message });
  }
}
