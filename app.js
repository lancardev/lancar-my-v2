import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 1) Masukkan URL & ANON KEY projek Supabase anda
const SUPABASE_URL     = 'https://bpxmqwgxjzphbavaikhq.supabase.co';
const SUPABASE_ANON_KEY= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweG1xd2d4anpwaGJhdmFpa2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODI4MzIsImV4cCI6MjA2MTg1ODgzMn0.4Xqo2frDn8h09IZDSpDQdfv9LQO5g3tyPomHie0iAo0';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2) Ambil email dari query string (?email=...)
const params = new URLSearchParams(window.location.search);
const email  = params.get('email');

async function init() {
  const welcomeEl = document.getElementById('welcome');

  if (!email) {
    welcomeEl.innerText = 'Tiada email ditemui. Sila daftar semula.';
    return;
  }

  // 3) Simpan atau kemaskini user
  const { error: errUser } = await supabase
    .from('users')
    .upsert({ email });
  if (errUser) {
    console.error('Error simpan user:', errUser);
    welcomeEl.innerText = 'Gagal daftar: ' + errUser.message;
    return;
  }

  // 4) Papar selamat datang
  welcomeEl.innerHTML = `Anda dilog masuk sebagai <strong>${email}</strong>`;

  // 5) Event “LANCAR”
  document.getElementById('create-btn').onclick = async () => {
    const title = document.getElementById('project-title').value.trim();
    const code  = document.getElementById('user-code').value.trim();
    if (!title || !code) {
      alert('Sila isi nama projek dan tampal kod AI.');
      return;
    }

    // 6) Simpan projek ke Supabase
    const { data, error: errProj } = await supabase
      .from('projects')
      .insert([{ email, title, code }]);
    if (errProj) {
      console.error('Error simpan projek:', errProj);
      alert('Gagal simpan projek. Sila cuba lagi.');
    } else {
      alert(`Terima kasih! Projek anda (${title}.lancar.my) sedang diproses.`);
      // (Nanti kita tambah automasi create subdomain)
    }
  };
}

init();
