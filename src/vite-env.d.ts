/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
  /** Lovable / Supabase publishable (anon) key */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  /** Legacy alias for VITE_SUPABASE_PUBLISHABLE_KEY */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
