// pages/index.js
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default function Page({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export async function getServerSideProps({ req }) {
  // 1) Tentukan host/subdomain
  const host = (req.headers.host || '').split(':')[0]
  const subdomain = host.split('.')[0]

  // 2) Jika root domain, keluarkan static homepage
  if (host === 'lancar.my' || host === 'www.lancar.my') {
    const filePath = path.join(process.cwd(), 'public', 'static', 'index.html')
    const html = fs.readFileSync(filePath, 'utf8')
    return { props: { html } }
  }

  // 3) Otherwise, panggil Supabase ikut subdomain
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data, error } = await supabase
    .from('projects')
    .select('ai_code')
    .eq('code', subdomain)
    .single()

  // 4) Fallback “not found”
  let html = `<h1>Subdomain “${subdomain}” tidak dijumpai</h1>`
  if (!error && data?.ai_code) {
    html = data.ai_code
  }
  return { props: { html } }
}
