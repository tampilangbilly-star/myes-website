import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "node_modules/**", "_orig/**", "public/**"]),
  {
    rules: {
      // Gambar dari Supabase / pengguna kadang memakai <img> biasa (lihat SmartImage).
      "@next/next/no-img-element": "off",
    },
  },
]);
