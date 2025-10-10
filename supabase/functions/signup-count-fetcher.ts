// @ts-nocheck

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

const URL = 'https://moonshot.hackclub.com/api/stats/count';
const TIMEOUT_SECONDS = 20.0;

async function fetchSignupCount() {
  try {
    const response = await fetch(URL, {
      signal: AbortSignal.timeout(TIMEOUT_SECONDS * 1000)
    });
    if (!response.ok) throw new Error(`Fetching failed with HTTP status code ${response.status}`);
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error(`${error}`);
    return null;
  }
}
Deno.serve(async ()=>{
  const count = await fetchSignupCount();
  if (count === null) {
    return new Response('Server/network error', {
    status: 500
    });
  }

  const timestamp = new Date();
  timestamp.setMilliseconds(0); // Remove milliseconds
  const { error } = await supabase.from('signups').insert([
      {
      count,
      timestamp: timestamp.toISOString()
      }
  ]);

  if (error) {
    console.error('Insert error:', error);
    return new Response('Database insert failed', { status: 500 });
  }

  console.log(`${timestamp}: ${count} signups`);
  return new Response('Success', { status: 200 });
});
