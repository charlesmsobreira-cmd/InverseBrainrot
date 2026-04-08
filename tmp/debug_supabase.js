const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables for Supabase are missing in .env.local');
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
    console.error('Supabase Error Details:');
    console.error(JSON.stringify(error, null, 2));
  } else {
    console.log('Success! Inserted data:', data);
  }
}

debugInsert();
