// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/Projects/LitePad/node_modules/.pnpm/vite@5.3.4_@types+node@20.14.12_lightningcss@1.25.1/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Projects/LitePad/node_modules/.pnpm/@vitejs+plugin-vue@5.1.0_vite@5.3.4_@types+node@20.14.12_lightningcss@1.25.1__vue@3.4.33_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///D:/Projects/LitePad/node_modules/.pnpm/unplugin-vue-components@0.27.3_@babel+parser@7.24.8_rollup@4.19.0_vue@3.4.33_typescript@5.4.5_/node_modules/unplugin-vue-components/dist/vite.js";
import { PrimeVueResolver } from "file:///D:/Projects/LitePad/node_modules/.pnpm/@primevue+auto-import-resolver@4.0.1/node_modules/@primevue/auto-import-resolver/index.mjs";
import { browserslistToTargets } from "file:///D:/Projects/LitePad/node_modules/.pnpm/lightningcss@1.25.1/node_modules/lightningcss/node/index.mjs";
import browserslist from "file:///D:/Projects/LitePad/node_modules/.pnpm/browserslist@4.23.2/node_modules/browserslist/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/Projects/LitePad/vite.config.ts";
var vite_config_default = defineConfig({
  build: {
    cssMinify: "lightningcss"
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: browserslistToTargets(browserslist(">= 0.25%"))
    }
  },
  plugins: [vue(), Components({ resolvers: [PrimeVueResolver()] })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxMaXRlUGFkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxMaXRlUGFkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy9MaXRlUGFkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XG5pbXBvcnQgeyBQcmltZVZ1ZVJlc29sdmVyIH0gZnJvbSBcIkBwcmltZXZ1ZS9hdXRvLWltcG9ydC1yZXNvbHZlclwiO1xuaW1wb3J0IHsgYnJvd3NlcnNsaXN0VG9UYXJnZXRzIH0gZnJvbSBcImxpZ2h0bmluZ2Nzc1wiO1xuaW1wb3J0IGJyb3dzZXJzbGlzdCBmcm9tIFwiYnJvd3NlcnNsaXN0XCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBidWlsZDoge1xuICAgIGNzc01pbmlmeTogXCJsaWdodG5pbmdjc3NcIixcbiAgfSxcbiAgY3NzOiB7XG4gICAgdHJhbnNmb3JtZXI6IFwibGlnaHRuaW5nY3NzXCIsXG4gICAgbGlnaHRuaW5nY3NzOiB7XG4gICAgICB0YXJnZXRzOiBicm93c2Vyc2xpc3RUb1RhcmdldHMoYnJvd3NlcnNsaXN0KFwiPj0gMC4yNSVcIikpLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFt2dWUoKSwgQ29tcG9uZW50cyh7IHJlc29sdmVyczogW1ByaW1lVnVlUmVzb2x2ZXIoKV0gfSldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlQLFNBQVMsZUFBZSxXQUFXO0FBRXBSLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLHdCQUF3QjtBQUNqQyxTQUFTLDZCQUE2QjtBQUN0QyxPQUFPLGtCQUFrQjtBQVAwSCxJQUFNLDJDQUEyQztBQVVwTSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsYUFBYTtBQUFBLElBQ2IsY0FBYztBQUFBLE1BQ1osU0FBUyxzQkFBc0IsYUFBYSxVQUFVLENBQUM7QUFBQSxJQUN6RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLEdBQUcsV0FBVyxFQUFFLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQ2hFLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
