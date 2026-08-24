const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");

function readEnvironmentFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
        return [key, value];
      }),
  );
}

const frontendEnvironment = readEnvironmentFile(
  path.join(projectRoot, "frontend", ".env.development"),
);
const backendEnvironment = readEnvironmentFile(
  path.join(projectRoot, "backend", ".env.development"),
);
const frontendPort = frontendEnvironment.PORT || process.env.FRONTEND_PORT || "3000";
const backendPort = backendEnvironment.PORT || process.env.BACKEND_PORT || "4000";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [];
let isStopping = false;

function stopApplications(exitCode = 0) {
  if (isStopping) {
    return;
  }

  isStopping = true;
  children.forEach((child) => {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  });
  process.exitCode = exitCode;
}

function startApplication(name, workingDirectory, environment) {
  const child = spawn(npmCommand, ["run", "dev"], {
    cwd: path.join(projectRoot, workingDirectory),
    env: { ...process.env, ...environment },
    stdio: "inherit",
  });

  child.on("error", (error) => {
    console.error(`${name} başlatılamadı:`, error.message);
    stopApplications(1);
  });

  child.on("exit", (code) => {
    if (!isStopping) {
      console.error(`${name} süreci kapandı (kod: ${code ?? "bilinmiyor"}).`);
      stopApplications(code || 1);
    }
  });

  children.push(child);
}

console.log(`Frontend: http://localhost:${frontendPort}`);
console.log(`Backend:  http://localhost:${backendPort}`);

startApplication("Frontend", "frontend", {
  ...frontendEnvironment,
  PORT: frontendPort,
  NEXT_PUBLIC_SITE_URL:
    frontendEnvironment.NEXT_PUBLIC_SITE_URL || `http://localhost:${frontendPort}`,
  NEXT_PUBLIC_API_BASE_URL:
    frontendEnvironment.NEXT_PUBLIC_API_BASE_URL ||
    `http://localhost:${backendPort}/api/akifclinic/v1`,
});
startApplication("Backend", "backend", {
  ...backendEnvironment,
  PORT: backendPort,
  CORS_ORIGINS:
    backendEnvironment.CORS_ORIGINS || `http://localhost:${frontendPort}`,
});

process.on("SIGINT", () => stopApplications());
process.on("SIGTERM", () => stopApplications());
