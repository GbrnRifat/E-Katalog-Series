import dotenv from "dotenv"; 
import { createClient } from "@supabase/supabase-js"; 
dotenv.config(); 
const supabaseUrl = process.env.VITE_SUPABASE_URL; 
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 
export const supabase = createClient(supabaseUrl, supabaseKey); 
