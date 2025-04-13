import { createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY || ''

console.log("This is url", supabaseUrl)
console.log("This is url", supabaseKey)

// Create a single instance to be used throughout the app
const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  );