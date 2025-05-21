const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  // Dapatkan subdomain dari URL
  const subdomain = req.query[0];

  // Ambil data projek berdasarkan subdomain
  const { data, error } = await supabase
    .from('projects')
    .select('title, code')
    .eq('title', subdomain)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Subdomain tidak dijumpai' });
  }

  // Render HTML dengan kod yang diperoleh dari Supabase
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="ms">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>${data.title}</h1>
      <pre>${data.code}</pre>
    </body>
    </html>
  `);
};
