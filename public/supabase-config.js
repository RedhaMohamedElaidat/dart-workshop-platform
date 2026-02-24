// ============================================
// SUPABASE CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://lmcfgnraayxurvwemvzq.supabase.co';

// NOUVELLE CLÉ (celle que vous venez de me donner)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtY2ZnbnJhYXl4dXJ2d2VtdnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDE1OTcsImV4cCI6MjA4NzUxNzU5N30.6YIP8S2yLebwYcjHyjBvhdrs-U5WbwOmzA-XA_w8U8A';

// Initialiser Supabase client
window.supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("✅ Supabase client created:", window.supabase);
console.log("✅ URL:", SUPABASE_URL);
console.log("✅ New KEY (first 20 chars):", SUPABASE_ANON_KEY.substring(0, 20) + "...");
