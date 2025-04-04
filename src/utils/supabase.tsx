import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Missing REACT_APP_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseKey) {
  console.error(
    "Missing REACT_APP_PUBLIC_SUPABASE_ANON_KEY environment variable"
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");
