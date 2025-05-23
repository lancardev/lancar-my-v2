import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { subdomain } = req.query;

  if (!subdomain) {
    return res.status(400).send('Subdomain is required.');
  }

  const filePath = path.join(process.cwd(), 'projects', `${subdomain}.html`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Website not found.');
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
