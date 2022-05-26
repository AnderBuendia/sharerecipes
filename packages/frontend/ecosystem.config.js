module.exports = {
  apps: [
    {
      name: 'front',
      script: 'node dist/index.js',
      env: {
        NODE_ENV: 'dev',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
