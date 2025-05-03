// app.js
async function goToCheckout() {
    const form = new URLSearchParams({
      userSecretKey: 'kyyn0vbn-0ud7-z423-nafu-fro9p9o49cvw',
      categoryCode: 'mi2pe6lg',
      billName: 'Langganan Lancar.my',
      billDescription: 'Akses penuh Lancar.my selama 1 bulan',
      billPriceSetting: '1',
      billAmount: '100',
      billPayorInfo: '1',
      // tetapkan return URL dengan placeholder {CUSTOMER_EMAIL}
      billReturnUrl: 
        'https://lancar-my-v2.vercel.app/dashboard.html?email={CUSTOMER_EMAIL}',
      billCallbackUrl: 
        'https://lancar-my-v2.vercel.app/api/verify-payment'
    });
  
    const resp = await fetch(
      'https://toyyibpay.com/index.php/api/createBill',
      { method: 'POST', body: form }
    );
    const [ result ] = await resp.json();
    window.location.href = `https://toyyibpay.com/${result.BillCode}`;
  }
  
  // pasang event listener pada butang
  document.getElementById('daftar-btn')
          .addEventListener('click', goToCheckout);
  