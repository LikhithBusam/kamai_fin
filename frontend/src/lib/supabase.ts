import { createClient } from '@supabase/supabase-js' 
 
const supabaseUrl = 'https://ppkwqebglrkznjsrwccz.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwa3dxZWJnbHJrem5qc3J3Y2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzkyODksImV4cCI6MjA4NTYxNTI4OX0.XTCHiMMQKpRB818UhBP7hE6vknw9RGjX_VEh4A8j6vg' 
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 
