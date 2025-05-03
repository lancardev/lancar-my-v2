import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://bpxmqwgxjzphbavaikhq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweG1xd2d4anpwaGJhdmFpa2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODI4MzIsImV4cCI6MjA2MTg1ODgzMn0.4Xqo2frDn8h09IZDSpDQdfv9LQO5g3tyPomHie0iAo0'
);

async function init() {
  // 1) Semak sesi Supabase
  const { data: { session } } = await supabase.auth.getSession();
  // 2) Jika tiada sesi, redirect ke login
  if (!session) {
    window.location.href = '/login.html';
    return;
  }

  const email = session.user.email;
  const welcomeEl = document.getElementById('welcome');

  // 3) Upsert user & generate referral code (seperti sebelum ini)
  await supabase.from('users').upsert({ email });
  const { data: userArr } = await supabase
    .from('users')
    .select('referral_code')
    .eq('email', email)
    .single();
  let code = userArr.referral_code;
  if (!code) {
    code = Math.random().toString(36).substring(2,8).toUpperCase();
    await supabase.from('users')
      .update({ referral_code: code })
      .eq('email', email);
  }

  welcomeEl.innerHTML = `
    Anda dilog masuk sebagai <strong>${email}</strong>.<br/>
    <small>Kod referral anda: <strong>${code}</strong></small>
  `;

  // 4) Simpan projek seperti biasa
  document.getElementById('create-btn').onclick = async () => {
    const title = document.getElementById('project-title').value.trim();
    const codeAI= document.getElementById('user-code').value.trim();
    if (!title||!codeAI) return alert('Sila isi nama projek dan kod AI.');
    const { error } = await supabase
      .from('projects')
      .insert([{ email, title, code: codeAI }]);
    if (error) alert('Gagal simpan projek.');
    else      alert(`Projek (${title}.lancar.my) sedang diproses.`);
  };
}

init();
