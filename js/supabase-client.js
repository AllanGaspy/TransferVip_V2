import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://jvwjhrepodmhagocxzfv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2d2pocmVwb2RtaGFnb2N4emZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODM5OTcsImV4cCI6MjA4MTU1OTk5N30.IU7jtZBD_Sw0lWdgvKcc8axErxCb1DKJR5VlUON_je8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
