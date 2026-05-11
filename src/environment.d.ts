declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      /** Project URL, e.g. https://xxxx.supabase.co — used for public Storage URLs in the browser */
      NEXT_PUBLIC_SUPABASE_URL?: string
      SUPABASE_STORAGE_BUCKET?: string
      SUPABASE_STORAGE_REGION?: string
      SUPABASE_STORAGE_ENDPOINT?: string
      SUPABASE_STORAGE_ACCESS_KEY_ID?: string
      SUPABASE_STORAGE_SECRET_ACCESS_KEY?: string
    }
  }
}

export {}
