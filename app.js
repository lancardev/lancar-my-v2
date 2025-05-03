async function goToCheckout(email) {
    const form = new URLSearchParams({
      userSecretKey: 'kyyn0vbn-0ud7-z423-nafu-fro9p9o49cvw',     // Your Secret Key
      categoryCode: 'mi2pe6lg',                       // From your ToyyibPay category
      billName: 'Langganan Lancar.my',
      billDescription: 'Akses penuh Lancar.my selama 1 bulan',
      billPriceSetting: '1',        // fixed amount
      billAmount: '100',            // RM1.00 → 100 sen
      billPayorInfo: '1',           // collect email
      billEmail: email,             // pass customer email
      billReturnUrl: 'https://lancar-my-v2.vercel.app/dashboard.html?email=' + encodeURIComponent(email),
      billCallbackUrl: 'https://lancar-my-v2.vercel.app/api/verify-payment'
    });
  
    // 1) Panggil API
    const resp = await fetch(
      'https://toyyibpay.com/index.php/api/createBill',
      { method: 'POST', body: form }
    );
    const [ result ] = await resp.json();
    const billCode = result.BillCode;
  
    // 2) Redirect user ke ToyyibPay
    window.location.href = `https://toyyibpay.com/${billCode}`;
  }
  