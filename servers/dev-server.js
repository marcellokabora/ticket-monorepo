import { createServer } from 'vite';

const PORT = 5000;

console.log('🚀 Starting Development Server...\n');

const server = await createServer({
  configFile: false,
  plugins: [
    {
      name: 'custom-proxy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Redirect /react, /vue, /svelte, /booking, /dashboard to versions with trailing slash (safety net)
          if (req.url === '/react' || req.url === '/vue' || req.url === '/svelte' || req.url === '/booking' || req.url === '/dashboard') {
            res.writeHead(301, { Location: req.url + '/' });
            res.end();
            return;
          }
          next();
        });
      }
    },
  ],
  server: {
    port: PORT,
    open: false, // Disable auto-open, we'll do it manually with a delay
    proxy: {
      '/react': {
        target: 'http://localhost:4304',
        changeOrigin: true,
      },
      '/vue': {
        target: 'http://localhost:4200',
        changeOrigin: true,
      },
      '/svelte': {
        target: 'http://localhost:4201',
        changeOrigin: true,
      },
      '/booking': {
        target: 'http://localhost:4202',
        changeOrigin: true,
      },
      '/dashboard': {
        target: 'http://localhost:4203',
        changeOrigin: true,
      },
      // Homepage (Next.js) serves the root route
      '^/(?!react|vue|svelte|booking|dashboard).*': {
        target: 'http://localhost:4205',
        changeOrigin: true,
      },
    },
  },
});

await server.listen();

console.log(`✅ Dev server running at http://localhost:${PORT}`);
console.log(`🏠 Homepage:    http://localhost:${PORT}/`);
console.log(`📊 Dashboard:   http://localhost:${PORT}/dashboard/`);
console.log(`⚛️ React App:   http://localhost:${PORT}/react/`);
console.log(`💚 Nuxt App:    http://localhost:${PORT}/vue/`);
console.log(`🔥 Svelte App:  http://localhost:${PORT}/svelte/`);
console.log(`✈️ Booking App: http://localhost:${PORT}/booking/\n`);

// Wait for apps to be ready before opening browser
console.log('⏳ Waiting for apps to start...');
setTimeout(async () => {
  const { default: open } = await import('open');
  await open(`http://localhost:${PORT}/`);
  console.log('🌐 Browser opened');
}, 3000); // 3 second delay
