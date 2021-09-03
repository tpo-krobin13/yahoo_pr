const config = require('../config');
const axios = require('axios');
const qs = require('qs');
const btoa = require('btoa');
const cfg = require('../config/');


const yahooLocalRedirect = `https://${cfg.domain}:${cfg.sslPort}/${cfg.yahooRedirectRoute}`

   function api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    if(requiresAuth) {
      const encodedCredentials = btoa(`${config.yahoo.app_key}:${config.yahoo.app_secret}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

   async function getAccessToken(code) {
    const instance = axios.create({
      baseURL: config.yahoo.auth_url,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    let bodyData = qs.stringify({
      grant_type: 'authorization_code',
      redirect_uri: `${yahooLocalRedirect}`,
      code: code
    })

    const basicAuth = 'Basic ' + btoa(`${config.yahoo.app_key}:${config.yahoo.app_secret}`);


    const response = await instance.post('get_token', bodyData, {
      auth: {
        username: config.yahoo.app_key,
        password: config.yahoo.app_secret
      }
    });

    return response
  }

   async function getRefreshToken(token) {
    const instance = axios.create({
      baseURL: config.yahoo.auth_url,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    let bodyData = qs.stringify({
      grant_type: 'refresh_token',
      redirect_uri: `${yahooLocalRedirect}`,
      refresh_token: token
    })

    const basicAuth = 'Basic ' + btoa(`${config.yahoo.app_key}:${config.yahoo.app_secret}`);


    const response = await instance.post('get_token', bodyData, {
      auth: {
        username: config.yahoo.app_key,
        password: config.yahoo.app_secret
      }
    });

    return response
  }

  async function yahooFSResource(resource, resourceKey) {
    // https://fantasysports.yahooapis.com/fantasy/v2/{resource}/{resource_key}
    const response = await axios.get(`${config.yfSports.baseApiUrl}${resource}/${resourceKey}` );
    console.log(response)
  }

  async function yahooFSCollection(collection, resource, resourceKeys) {
    // https://fantasysports.yahooapis.com/fantasy/v2/{collection};{resource}
    const response = await axios.get(`${config.yfSports.baseApiUrl}${collection};${resource}_keys=${resourceKeys}` );
    console.log(response)
  }


module.exports = {
  api: api,
  getAccessToken: getAccessToken
}