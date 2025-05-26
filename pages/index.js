// pages/index.js
import { createClient } from '@supabase/supabase-js'

export default function SubdomainPage({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export async function getServerSideProps({ req }) {
  // 1) figure out the subdomain from the Host header
  const host = req.headers.host || ''
  const subdomain = host.split('.')[0]

  // 2) init Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // 3) pull the AI code for that “code” column
  const { data, error } = await supabase
    .from('projects')
    .select('ai_code')
    .eq('code', subdomain)
    .limit(1)
    .single()

  // 4) default “not found” fallback
  let html = `<h1>Subdomain “${subdomain}” not found</h1>`
  if (!error && data?.ai_code) {
    html = data.ai_code
  }

  return {
    props: { html },
  }
}
