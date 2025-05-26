// pages/index.js
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default function Page({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export async function getServerSideProps({ req }) {
  const host = (req.headers.host || '').split(':')[0]
  const subdomain = host.split('.')[0]

  // 1) If this is the root domain, load the static file:
  if (host === 'lancar.my' || host === 'www.lancar.my') {
    const filePath = path.join(process.cwd(), 'public', 'static', 'index.html')
    const html = fs.readFileSync(filePath, 'utf8')
    return { props: { html } }
  }

  // 2) Otherwise it’s a subdomain – fetch the user's AI code:
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data, error } = await supabase
    .from('projects')
    .select('ai_code')
    .eq('code', subdomain)
    .single()

  let html = `<h1>Subdomain “${subdomain}” not found</h1>`
  if (!error && data?.ai_code) {
    html = data.ai_code
  }

  return { props: { html } }
}
