import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const host = req.headers.host || '';
  const subdomain = host.split('.')[0];

  if (!subdomain || subdomain === 'lancar') {
    return res.status(404).send('Subdomain not found');
  }

  const { data, error } = await supabase
    .from('projects')
    .select('code')
    .eq('title', subdomain)
    .single();

  if (error || !data) {
    return res.status(404).send('Project not found');
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(data.code);
}
