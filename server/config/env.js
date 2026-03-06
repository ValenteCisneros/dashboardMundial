require('dotenv').config();

const required = ['DATABASE_URL'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required env: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
};
