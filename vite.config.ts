import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Pages serves this repo at https://<user>.github.io/PG-Master/
const base = process.env.GITHUB_ACTIONS ? "/PG-Master/" : "/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
