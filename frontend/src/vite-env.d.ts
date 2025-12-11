/// <reference types="vite/client" />

// Extend ImportMetaEnv to add custom environment variables
// Vite's types already provide ImportMeta with env: ImportMetaEnv
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  // Add other env variables here as needed
}

