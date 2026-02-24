// ============================================
// SUPABASE CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://lmcfgnraayxurvwemvzq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_RU-703uhus4WN11X6USN1A_I_vOk4nV';

// Initialiser Supabase - CORRECTION !
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase initialized:', supabase);
