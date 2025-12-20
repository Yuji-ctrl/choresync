// ローカル開発環境用の設定
export const projectId =
  process.env.VITE_SUPABASE_PROJECT_ID || "demo-project";
export const publicAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY || "demo-key";