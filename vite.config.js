import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import react from "@vitejs/plugin-react";
import { pickEnv } from "./src/utilities/envConfig";
import aliases from "./aliases";
// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  const buildEnv = {
    ...env.APP_ENV,
    ...pickEnv(process.env),
  };
  console.log("build env", buildEnv);
  return {
    resolve: {
      alias: aliases,
    },
    plugins: [
      react(),
      VitePWA({
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
        manifest: {
          name: "FX1",
          short_name: "FX1",
          theme_color: "#ffffff",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        injectRegister: "auto",
        registerType: "autoUpdate",
      }),
    ],
    define: {
      __APP_ENV__: buildEnv,
    },
  };
});
