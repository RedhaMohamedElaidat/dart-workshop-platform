// ============================================
// SUPABASE CONFIGURATION
// ============================================

// REMPLACEZ CES VALEURS PAR VOS CLÉS SUPABASE !
const SUPABASE_URL = 'https://lmcfgnraayxurvwemvzq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_RU-703uhus4WN11X6USN1A_I_vOk4nV';

// Initialiser Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase initialized');