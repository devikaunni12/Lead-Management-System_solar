/**
 * This file configures Vite for the React frontend.
 * It enables the React plugin so .tsx files work correctly.
 */

import { defineConfig } from "vite"; // defineConfig gives helpful typing and auto-complete.
import react from "@vitejs/plugin-react"; // React plugin handles JSX and React fast refresh.

// Export Vite configuration object.
export default defineConfig({
  // plugins list includes React support.
  plugins: [react()],
});
