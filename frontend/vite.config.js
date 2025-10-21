import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // ✅ Correct plugin import
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()], // ✅ use react(), not React()
});
