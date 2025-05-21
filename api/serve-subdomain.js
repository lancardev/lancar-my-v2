const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  const host = req.headers.host || '';
  const mainDomain = 'lancar.my';

  // Pisahkan subdomain
  const subdomain = host.endsWith(mainDomain)
    ? host.replace(`.${mainDomain}`, '')
    : null;

  if (!subdomain || subdomain === 'www' || subdomain === 'lancar') {
    return res.status(404).send('Subdomain tidak sah.');
  }

  const { data, error } = await supabase
    .from('projects')
    .select('title, code')
    .eq('title', subdomain)
    .single();

  if (error || !data) {
    return res.status(404).send('Subdomain tidak dijumpai.');
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(data.code);
};
