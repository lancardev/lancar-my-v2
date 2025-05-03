// app.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Gantikan dengan nilai anda
const SUPABASE_URL     = 'https://bpxmqwgxjzphbavaikhq.supabase.co';
const SUPABASE_ANON_KEY= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweG1xd2d4anpwaGJhdmFpa2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODI4MzIsImV4cCI6MjA2MTg1ODgzMn0.4Xqo2frDn8h09IZDSpDQdfv9LQO5g3tyPomHie0iAo0';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function initDashboard() {
  const params   = new URLSearchParams(window.location.search);
  const email    = params.get('email');
  const welcomeE = document.getElementById('welcome');

  if (!email) {
    welcomeE.innerText = 'Tiada email ditemukan. Sila daftar semula.';
    return;
  }

  // 1) Upsert user
  const { error: userErr } = await supabase
    .from('users')
    .upsert({ email });
  if (userErr) {
    welcomeE.innerText = 'Gagal daftar: ' + userErr.message;
    console.error(userErr);
    return;
  }

  // 2) Dapatkan/Generate referral_code
  let { data: users, error: fetchErr } = await supabase
    .from('users')
    .select('referral_code')
    .eq('email', email)
    .single();
  if (fetchErr) { console.error(fetchErr); }

  let code = users?.referral_code;
  if (!code) {
    code = Math.random().toString(36).substring(2,8).toUpperCase();
    const { error: updErr } = await supabase
      .from('users')
      .update({ referral_code: code })
      .eq('email', email);
    if (updErr) console.error(updErr);
  }

  // 3) Tunjuk ucapan selamat datang + code
  welcomeE.innerHTML = `
    Anda dilog masuk sebagai <strong>${email}</strong>.<br/>
    <small>Kod referral anda: <strong>${code}</strong></small>
  `;

  // 4) Event click “LANCAR”
  document.getElementById('create-btn').onclick = async () => {
    const title = document.getElementById('project-title').value.trim();
    const codeAI= document.getElementById('user-code').value.trim();
    if (!title || !codeAI) {
      return alert('Sila isi nama projek dan tampal kod AI.');
    }
    const { error: projErr } = await supabase
      .from('projects')
      .insert([{ email, title, code: codeAI }]);
    if (projErr) {
      console.error(projErr);
      alert('Gagal simpan projek: ' + projErr.message);
    } else {
      alert(`Terima kasih! Projek ${title}.lancar.my akan diproses.`);
    }
  };
}

initDashboard();