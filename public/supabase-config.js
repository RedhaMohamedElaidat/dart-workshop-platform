// ============================================
// SUPABASE CONFIGURATION - CORRIGÉ
// ============================================

console.log('Loading Supabase config...');

// Attendre que supabase-js soit chargé
if (typeof window === 'undefined' || !window.supabase) {
  console.error('❌ Supabase JS library not loaded yet!');
} else {
  console.log('✅ Supabase JS library found!');
}

const SUPABASE_URL = 'https://lmcfgnraayxurvwemvzq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_RU-703uhus4WN11X6USN1A_I_vOk4nV';

console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// Initialiser Supabase
let supabase = null;

try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase initialized successfully!');
  console.log('Supabase object:', supabase);
} catch (err) {
  console.error('❌ Error initializing Supabase:', err);
}

// Tester la connexion
if (supabase) {
  supabase
    .from('users')
    .select('count', { count: 'exact', head: true })
    .then(({ count, error }) => {
      if (error) {
        console.error('❌ Database connection error:', error);
      } else {
        console.log(`✅ Database connected! Total users: ${count}`);
      }
    })
    .catch(err => console.error('❌ Connection test error:', err));
}
