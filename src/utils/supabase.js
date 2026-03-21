import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bhxkitexxvzuadfwnwcp.supabase.co";

const supabaseKey = "sb_publishable_vbnSeQCzH09Yei43ykauQg_M_xaTHsf";

export const supabase = createClient( supabaseUrl , supabaseKey);