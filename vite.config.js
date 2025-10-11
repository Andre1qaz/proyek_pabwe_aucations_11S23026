import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");  // baca .env & Vercel env

  return {
    plugins: [react()],
    build: {
      outDir: "dist",           // <— JANGAN pakai "../public_html"
      emptyOutDir: false
    },
    define: {
      // injeksikan env yang dibutuhkan ke client
      DELCOM_BASEURL: JSON.stringify(env.VITE_DELCOM_BASEURL),
    },
    base: "/",                  // aman untuk deploy di root domain
  };
});