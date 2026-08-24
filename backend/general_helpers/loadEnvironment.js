const path = require("node:path");
const dotenv = require("dotenv");

function loadEnvironment() {
  const environment = process.env.NODE_ENV || "development";
  const environmentFile = path.resolve(process.cwd(), `.env.${environment}`);
  const defaultFile = path.resolve(process.cwd(), ".env");

  dotenv.config({ path: environmentFile, quiet: true });
  dotenv.config({ path: defaultFile, quiet: true, override: false });
}

module.exports = loadEnvironment;
