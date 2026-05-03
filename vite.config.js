import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],

  server: {
    proxy: {
      // data.sec.gov  →  companyfacts, submissions, company_tickers
      "/sec-api": {
        target: "https://data.sec.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sec-api/, ""),
        headers: {
          "User-Agent": "SECExplorer/1.0 dev@example.com",
          "Accept-Encoding": "gzip, deflate",
        },
      },

      // www.sec.gov  →  /files/company_tickers.json
      "/sec-tickers": {
        target: "https://www.sec.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sec-tickers/, ""),
        headers: {
          "User-Agent": "SECExplorer/1.0 dev@example.com",
          "Accept-Encoding": "gzip, deflate",
        },
      },
    },
  },
});
