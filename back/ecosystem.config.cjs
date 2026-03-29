module.exports = {
  apps: [
    {
      name: "fyp-backend",
      script: "server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
      autorestart: true, // PM2 will restart on crash/exit
      watch: false,
    },
  ],
};
