import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const host = req.headers.host; // contoh: helloworld1.lancar.my
  const subdomain = host.split(".")[0];

  if (!subdomain || subdomain === "lancar" || subdomain === "www") {
    return res.status(404).send("Not Found");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("code")
    .eq("title", subdomain)
    .single();

  if (error || !data || !data.code) {
    return res.status(404).send("Subdomain not found.");
  }

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(data.code);
}
