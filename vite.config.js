import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * A stylesheet in <head> blocks the first paint of the whole document, so the
 * boot splash in index.html — styled inline, ready to draw the moment the HTML
 * lands — was still stuck behind the CSS download. On a throttled connection
 * that was ~2s of white screen for nothing.
 *
 * rel="preload" as="style" fetches at normal stylesheet priority but does not
 * block rendering; onload promotes it to a real stylesheet. The <noscript> copy
 * covers the case where the onload never runs.
 *
 * Build only: in dev, Vite injects styles through JS and there is no link to
 * rewrite.
 */
const asyncCss = () => ({
  name: 'async-css',
  apply: 'build',
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet"([^>]*?)href="([^"]+)"([^>]*)>/g,
      (_m, before, href, after) =>
        `<link rel="preload" as="style"${before}href="${href}"${after} onload="this.rel='stylesheet';this.onload=null">` +
        `<noscript><link rel="stylesheet" href="${href}"></noscript>`
    )
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), asyncCss()],
})
