import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(() => {
  const supabase = createClient(
    useRuntimeConfig().public.SUPABASE_URL,
    useRuntimeConfig().public.SUPABASE_KEY
  );
  return { provide: { supabase } };
});
