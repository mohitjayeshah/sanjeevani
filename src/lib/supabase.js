import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kpkiikdfmuhjcksbcuus.supabase.co';
// We use the publishable key on the frontend to keep your secret key safe!
const supabaseKey = 'sb_publishable_mTfOOejNKpU3T1T2o8Bxrw_cn04yuen';

export const supabase = createClient(supabaseUrl, supabaseKey);
