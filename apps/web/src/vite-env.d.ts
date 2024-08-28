/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other Vite env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
