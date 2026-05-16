import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const PLACEHOLDER = /YOUR_|your_supabase_anon/i;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const anonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!anonKey?.trim() || PLACEHOLDER.test(anonKey)) {
    console.warn(
      "[AuthSentry] VITE_SUPABASE_PUBLISHABLE_KEY is not set. Scanning will be disabled until you add your Supabase anon key to .env or Vercel environment variables.",
    );
  }

  return {
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
});
