import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind on all interfaces — sandboxes (v0, Codespaces, containers) proxy in
    // from outside, and the default localhost-only bind refuses them.
    host: true,
    // Honour a port assigned by the launcher, fall back to Vite's default.
    port: Number(process.env.PORT) || 5173,
    /**
     * Vite blocks requests whose Host header it does not recognise, as
     * protection against DNS rebinding. Hosted preview sandboxes serve the dev
     * server on a generated subdomain — v0 uses `sb-<random>.vercel.run` — and
     * that changes on every run, so a single hostname is no use here.
     *
     * A leading dot allows any subdomain, which covers the generated hosts
     * without switching the check off entirely (`allowedHosts: true` would
     * accept ANY Host header and drop the protection altogether).
     */
    allowedHosts: ['.vercel.run', '.vercel.app', '.v0.dev', '.app.github.dev', 'localhost'],
  },
  preview: {
    host: true,
    allowedHosts: ['.vercel.run', '.vercel.app', '.v0.dev', '.app.github.dev', 'localhost'],
  },
})
