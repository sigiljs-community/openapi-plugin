import { builtinModules } from "node:module"
import * as path from "node:path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  publicDir: false,
  plugins: [
    tsconfigPaths(),
    dts({
      entryRoot: "src",
      outDir: "dist",
      exclude: ["specs/**"]
    })
  ],
  build: {
    target: "node24",
    minify: true,
    lib: {
      entry: {
        "openapi-plugin": path.resolve(__dirname, "src/index.ts"),
      },
      name: "openapi-plugin",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        "@sigiljs/openapi-transformer",
        "@sigiljs/sigil"
      ],
      output: { exports: "named", preserveModules: true, interop: "auto" }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    },
    ssr: true
  }
})