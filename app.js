// app.js (homepage)
async function goToCheckout() {
    // Setup data untuk call ToyyibPay API
    const form = new URLSearchParams({
      userSecretKey: 'kyyn0vbn-0ud7-z423-nafu-fro9p9o49cvw',
      categoryCode:   'mi2pe6lg',
      billName:       'Langganan Lancar.my',
      billDescription:'Akses penuh Lancar.my selama 1 bulan',
      billPriceSetting: '1',
      billAmount:      '100',            // RM1.00 → 100 sen
      billPayorInfo:   '1',              // collect email at ToyyibPay
      billReturnUrl:   
        'https://lancar-my-v2.vercel.app/dashboard.html?email={CUSTOMER_EMAIL}',
      billCallbackUrl:
        'https://lancar-my-v2.vercel.app/api/verify-payment'
    });
  
    // Panggil API CreateBill
    const resp = await fetch('https://toyyibpay.com/index.php/api/createBill', {
      method: 'POST',
      body: form
    });
  
    if (!resp.ok) {
      return alert('Gagal hubungi ToyyibPay. Sila cuba lagi.');
    }
  
    const [ result ] = await resp.json();
    const billCode = result.BillCode;
  
    // Redirect ke halaman pembayaran ToyyibPay
    window.location.href = `https://toyyibpay.com/${billCode}`;
  }
  
  // Tunggu DOM siap, kemudian pasang listener
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('daftar-btn');
    if (!btn) {
      console.error("Butang #daftar-btn tidak ditemui dalam index.html");
      return;
    }
    btn.addEventListener('click', goToCheckout);
  });
  