import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const host = req.headers.host; // helloworld1.lancar.my
  const subdomain = host.split(".")[0];

  // Abaikan main domain
  if (!subdomain || subdomain === "www" || subdomain === "lancar") {
    return res.status(404).send("Not found");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("code")
    .eq("title", subdomain)
    .single();

  if (error || !data) {
    return res.status(404).send("No project found for this subdomain.");
  }

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(data.code);
}
