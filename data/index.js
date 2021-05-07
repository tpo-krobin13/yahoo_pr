const config = require('../config');
const axios = require('axios');
const qs = require('qs');
const btoa = require('btoa');



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
      redirect_uri: 'https://127.0.0.1:4000/authRedirect',
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

module.exports = {
  api: api,
  getAccessToken: getAccessToken
}