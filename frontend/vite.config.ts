import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnpluginTypia({
      /* options */
    }),
    react(),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
