import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local from the root of apple-brain
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables for Supabase are missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugInsert() {
  console.log('Testing Supabase insert for "highlights" table...');
  
  const testLog = {
    title: 'Debug Test',
    description: 'Manual debug insert',
    subtitle: 'Debug Artist',
    date: '08/04',
    image_url: '/logs/debug.png',
    category: 'Música',
    rating: 5,
    is_liked: true
  };

  const { data, error } = await supabase.from('highlights').insert([testLog]).select();
  
  if (error) {
    console.error('Supabase Error Code:', error.code);
    console.error('Supabase Error Message:', error.message);
    console.error('Supabase Error Details:', error.details);
    console.error('Supabase Error Hint:', error.hint);
  } else {
    console.log('Success! Inserted data:', data);
  }
}

debugInsert();
