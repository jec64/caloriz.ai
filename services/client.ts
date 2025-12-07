
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fzltzpzyzxhcphiemoel.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bHR6cHp5enhoY3BoaWVtb2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTM5ODMsImV4cCI6MjA4MDQyOTk4M30.LkSLUJz1FX5eJqvMkV1DpD2TXzE3rL_JfUBbNrmsXLs';

export const supabase = createClient(supabaseUrl, supabaseKey);
