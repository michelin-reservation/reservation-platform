module.exports = {
  apps: [{
    name: 'michelin-api',
    script: './backend/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: { NODE_ENV: 'production' }
  }]
}; 