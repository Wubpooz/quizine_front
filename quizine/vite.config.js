export default {
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://quiz.kerboul.me',
        changeOrigin: true,
        secure: false,
      }
    },
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    },
  },
  // This is important when using Docker
  allowedHosts: [
    'localhost',
    'quiz.kerboul.me'
  ]
};
