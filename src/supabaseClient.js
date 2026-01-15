import { createClient } from '@supabase/supabase-js';

// URL do seu projeto Supabase
const supabaseUrl = 'https://maataycmixcmozjhezfe.supabase.co';

// Sua chave Publishable (Anon)
const supabaseKey = 'sb_publishable_0Z-FCcQBbse1uADgFcgzNQ_6JJ66eeY';

export const supabase = createClient(supabaseUrl, supabaseKey);
