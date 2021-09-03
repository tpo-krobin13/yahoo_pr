// config.js
const dotenv = require('dotenv');
const result = dotenv.config();
//const result = dotenv.config();
module.exports = {
  port: process.env.PORT,
  sslPort: process.env.SSL_PORT,
  domain: process.env.DOMAIN,
  yahooRedirectRoute: process.env.YREDIRECT_BASE_PAGE,


  hostUrl: process.env.HOST_URL,
  yahooRedirectUrl: process.env.YREDIRECT_BASE_URL + ":" + process.env.HOST_HTTPS_PORT +"/" + process.env.YREDIRECT_BASE_PAGE,
  yahooAppSecret: process.env.YAPPLICATION_SECRET,
  yahooAppKey: process.env.YAPPLICATION_KEY,
  yahooAppCallbackFunction: process.env.YTOKEN_CALLBACK_FUNCTION
};