import { defineConfig } from "vite";
import { resolve } from "node:path";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
  plugins: [handlebars({ partialDirectory: resolve(__dirname, "partials") })],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        // Add each new page here as you build it:
        menu: resolve(__dirname, "menu.html"),
        find: resolve(__dirname, "find-a-chickano.html"),
        franchising: resolve(__dirname, "franchising.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
