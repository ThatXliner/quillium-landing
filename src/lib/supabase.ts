import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://ccltcbdxbssscxqolght.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbHRjYmR4YnNzc2N4cW9sZ2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTM1OTcsImV4cCI6MjA4OTc4OTU5N30.LjQ8-Fx4gU4tJUKtAy-eE__XLcVF_2EWPPMZiRSZBLM'
);
