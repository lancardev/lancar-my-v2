import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL      = 'https://bpxmqwgxjzphbavaikhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweG1xd2d4anpwaGJhdmFpa2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODI4MzIsImV4cCI6MjA2MTg1ODgzMn0.4Xqo2frDn8h09IZDSpDQdfv9LQO5g3tyPomHie0iAo0';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const params = new URLSearchParams(window.location.search);
const email  = params.get('email');

// Fungsi untuk buat 6 karakter alfanumerik rawak
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function init() {
  const welcomeEl = document.getElementById('welcome');
  if (!email) {
    welcomeEl.innerText = 'Tiada email ditemui. Sila daftar semula.';
    return;
  }

  // 1) Upsert user (tanpa referral_code)
  await supabase.from('users').upsert({ email });

  // 2) Ambil semula rekod user untuk tengok referral_code
  const { data: userArr, error: errUser } = await supabase
    .from('users')
    .select('referral_code')
    .eq('email', email)
    .limit(1);

  if (errUser) {
    console.error('Error fetch user:', errUser);
    welcomeEl.innerText = 'Gagal dapat data user.';
    return;
  }

  let code = userArr[0]?.referral_code;
  // 3) Jika tiada, jana dan update
  if (!code) {
    code = generateCode();
    const { error: errUpdate } = await supabase
      .from('users')
      .update({ referral_code: code })
      .eq('email', email);
    if (errUpdate) {
      console.error('Error update code:', errUpdate);
    }
  }

  // 4) Papar selamat datang + code
  welcomeEl.innerHTML = `
    Anda dilog masuk sebagai <strong>${email}</strong>.<br/>
    <small>Kod referral anda: <strong>${code}</strong></small>
  `;

  // — LANCAR projek seperti biasa —
  document.getElementById('create-btn').onclick = async () => {
    // ... (kod simpan projek)
  };
}

init();
