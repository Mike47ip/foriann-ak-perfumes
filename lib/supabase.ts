import { createClient } from "@supabase/supabase-js";

export const supabase = {
  from: (table: string) => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    return client.from(table);
  }
};