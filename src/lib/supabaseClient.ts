// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://orqxbrcenlohehwcusmt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXhicmNlbmxvaGVod2N1c210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTU4MTgsImV4cCI6MjA2OTk5MTgxOH0.Z9-VJQgwj9R73JgnO-2QjpZI7v3fc51ChcEDlEkALTo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 