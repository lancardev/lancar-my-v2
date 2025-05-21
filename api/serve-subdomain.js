import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const host = req.headers.host || '';
  const subdomain = host.split('.')[0];

  // Abaikan jika akses utama
  if (subdomain === 'www' || subdomain === 'lancar') {
    res.writeHead(302, { Location: '/index.html' });
    return res.end();
  }

  // Cari kod AI dari Supabase ikut subdomain
  const { data, error } = await supabase
    .from('projects')
    .select('code')
    .eq('title', subdomain)
    .single();

  if (error || !data) {
    return res.status(404).send('Subdomain tidak dijumpai');
  }

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(data.code);
}
