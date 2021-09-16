// config.js
const dotenv = require('dotenv');
const result = dotenv.config();
//const result = dotenv.config();
module.exports = {
  port: process.env.PORT,
  sslPort: process.env.SSL_PORT,
  domain: process.env.DOMAIN,
  yahooRedirectRoute: process.env.YREDIRECT_BASE_PAGE,
  sslKey: process.env.SSL_KEY,
  sslCert: process.env.SSL_CERT,
  yahooAuthUrl: process.env.YAUTH_URL,
  yahooAppSecret: process.env.YAPPLICATION_SECRET,
  yahooAppKey: process.env.YAPPLICATION_KEY,
  yahooApiUrl: process.env.YBASE_SPORTS_API,
  yahooGameKey: process.env.YGAME_KEY,
  yahooLeagueKey: process.env.YLEAGUE_KEY
};