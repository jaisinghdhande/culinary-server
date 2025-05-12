require("dotenv").config();

console.log(process.env.DB_CONNECTION_STRING);

const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database Configuration
  db: {
    uri: process.env.DB_CONNECTION_STRING,
  },

  // API Configuration
  api: {
    prefix: "/api",
    version: "v1",
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};

// Validate required environment variables
const requiredEnvVars = ["DB_CONNECTION_STRING"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

module.exports = config;
