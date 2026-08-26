const path = require("node:path");

const projectRoot = __dirname;
const frontendPort = String(process.env.FRONTEND_PORT || 3044);
const backendPort = String(process.env.BACKEND_PORT || 4040);
const productionCorsOrigins = [
  "https://akifpoliklinigi.com",
  "https://www.akifpoliklinigi.com",
].join(",");

module.exports = {
  apps: [
    {
      name: "akif-poliklinik-frontend",
      cwd: path.join(projectRoot, "frontend"),
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
      max_memory_restart: "512M",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: frontendPort,
      },
    },
    {
      name: "akif-poliklinik-backend",
      cwd: path.join(projectRoot, "backend"),
      script: "app.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
      max_memory_restart: "256M",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: backendPort,
        CORS_ORIGINS: productionCorsOrigins,
      },
    },
  ],
};
