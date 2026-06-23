const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mdwbliwwtumqkwlbyukq.supabase.co', 'sb_publishable_QDm9pmWVNE643OqIQsKYGg_4oj772tu');
supabase.from('games').select('*').eq('id', '7b5fe060-d75f-4e76-8521-06c07da58878').then(res => console.log(JSON.stringify(res.data)));
