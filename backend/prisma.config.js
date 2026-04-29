// prisma.config.js
require('dotenv').config(); // This loads your .env variables into the config

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};