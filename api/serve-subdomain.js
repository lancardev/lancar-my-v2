export default async function handler(req, res) {
  const host = req.headers.host || "";
  const subdomain = host.split(".")[0];

  // Sambung ke Supabase
  const SUPABASE_URL = "https://bpxmqwgxjzphbavaikhq.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweG1xd2d4anpwaGJhdmFpa2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODI4MzIsImV4cCI6MjA2MTg1ODgzMn0.4Xqo2frDn8h09IZDSpDQdfv9LQO5g3tyPomHie0iAo0";
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data, error } = await supabase
    .from("projects")
    .select("code")
    .eq("title", subdomain)
    .single();

  if (error || !data) {
    return res.status(404).send("Projek tidak dijumpai.");
  }

  res.setHeader("Content-Type", "text/html");
  res.send(data.code);
}
