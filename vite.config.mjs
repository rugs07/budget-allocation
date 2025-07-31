import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["rlfcvk-5173.csb.app"], // ✅ add your CodeSandbox hostname here
  },
});
