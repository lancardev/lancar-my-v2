import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const host = req.headers.host;
  const subdomain = host.split('.')[0]; // e.g., helloworld1

  if (!subdomain || subdomain === 'lancar') {
    res.status(404).send('Not Found');
    return;
  }

  const { data, error } = await supabase
    .from('projects')
    .select('code')
    .eq('title', subdomain)
    .single();

  if (error || !data) {
    res.status(404).send('Subdomain not found');
    return;
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(data.code);
}
