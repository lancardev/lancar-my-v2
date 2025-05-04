// app.js
import { createClient } 
  from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Ganti dengan credential projek Supabase anda
const SUPABASE_URL      = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function init() {
  // 1) Dapatkan sesi Supabase
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // 2) Jika tiada sesi, redirect ke login.html
    window.location.href = '/login.html';
    return;
  }

  const email    = session.user.email;
  const welcomeE = document.getElementById('welcome');

  // 3) Upsert user
  const { error: errUser } = await supabase
    .from('users')
    .upsert({ email });
  if (errUser) {
    welcomeE.innerText = 'Gagal daftar: ' + errUser.message;
    console.error(errUser);
    return;
  }

  // 4) Dapatkan atau jana referral_code
  const { data: userData, error: errFetch } = await supabase
    .from('users')
    .select('referral_code')
    .eq('email', email)
    .single();
  if (errFetch) console.error(errFetch);

  let code = userData?.referral_code;
  if (!code) {
    code = Math.random().toString(36).substring(2,8).toUpperCase();
    const { error: errUpd } = await supabase
      .from('users')
      .update({ referral_code: code })
      .eq('email', email);
    if (errUpd) console.error(errUpd);
  }

  // 5) Papar selamat datang + referral code
  welcomeE.innerHTML = `
    Anda dilog masuk sebagai <strong>${email}</strong>.<br/>
    <small>Kod referral anda: <strong>${code}</strong></small>
  `;

  // 6) Event click LANCAR
  document.getElementById('create-btn').onclick = async () => {
    const title  = document.getElementById('project-title').value.trim();
    const codeAI = document.getElementById('user-code').value.trim();
    if (!title || !codeAI) {
      return alert('Sila isi nama projek dan tampal kod AI.');
    }
    const { error: errProj } = await supabase
      .from('projects')
      .insert([{ email, title, code: codeAI }]);
    if (errProj) {
      console.error(errProj);
      alert('Gagal simpan projek: ' + errProj.message);
    } else {
      alert(`Terima kasih! Projek ${title}.lancar.my akan diproses.`);
    }
  };
}

init();

document.getElementById('logout-btn').onclick = async () => {
  await supabase.auth.signOut();
  window.location.href = '/';
};
