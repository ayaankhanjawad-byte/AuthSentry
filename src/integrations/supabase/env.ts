/** Matches project_id in supabase/config.toml */
export const SUPABASE_PROJECT_REF = "trlegeualmmmkcwomdtm";

export const SUPABASE_URL_DEFAULT = `https://${SUPABASE_PROJECT_REF}.supabase.co`;

const PLACEHOLDER_PATTERN =
  /YOUR_PROJECT_ID|YOUR_NEW_SUPABASE|your_supabase_anon_key|changeme|replace_me/i;

function isRealEnvValue(value: string | undefined): value is string {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  return !PLACEHOLDER_PATTERN.test(trimmed);
}

function readEnv(key: string): string | undefined {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  return typeof value === "string" ? value : undefined;
}

/** Resolved Supabase API URL (env override, then project ref, then default). */
export function resolveSupabaseUrl(): string {
  const fromUrl = readEnv("VITE_SUPABASE_URL");
  if (isRealEnvValue(fromUrl)) return fromUrl;

  const fromProjectId = readEnv("VITE_SUPABASE_PROJECT_ID");
  if (isRealEnvValue(fromProjectId)) {
    return `https://${fromProjectId}.supabase.co`;
  }

  return SUPABASE_URL_DEFAULT;
}

/**
 * Supabase anon (public) key. Accepts Lovable and legacy variable names:
 * VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY
 */
export function resolveSupabaseAnonKey(): string {
  const publishable = readEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  if (isRealEnvValue(publishable)) return publishable;

  const anon = readEnv("VITE_SUPABASE_ANON_KEY");
  if (isRealEnvValue(anon)) return anon;

  return "";
}

export const SUPABASE_URL = resolveSupabaseUrl();
export const SUPABASE_ANON_KEY = resolveSupabaseAnonKey();

export const isSupabaseConfigured = Boolean(SUPABASE_ANON_KEY);
