var fs = require('fs');
var http = require('http');
var https = require ('https');
const data = require('./data');
var Cookies = require('cookies');
var dt = require('date-and-time');
var cookieKeys = ['bfl fo life'];

const httpsOptions = {
  key: fs.readFileSync('/Users/krobinson/key.pem'),
  cert: fs.readFileSync('/Users/krobinson/cert.pem')
}


const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config');

const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/static',express.static('public'));
app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);


const refreshToken = () => {

}

const YahooFantasy = require('yahoo-fantasy');

const yf = new YahooFantasy(
  config.yahoo.app_key,
  config.yahoo.app_secret,
  refreshToken,
  'https://127.0.0.1:4000/authRedirect/'

)


app.use(async function (req, res, next) {
  let cookie = new Cookies(req, res, {keys: cookieKeys});
  let authUser = cookie.get('authenticatedUser', { signed: false });

  if(req.path === '/authRedirect') {
    
    const authToken = req.query.code;
    const response = await data.getAccessToken(authToken);

    const accessObject = transferCredentials(response.data);

    cookie.set('authenticatedUser', accessObject, { signed: false });
    const destination = cookie.get('destination_url', { signed: false });
    res.redirect(destination);
  }

  if(!authUser) {
    const url = `${config.yahoo.auth_url}request_auth?client_id=${config.yahoo.app_key}&redirect_uri=${config.yahoo.redirect_uri}&response_type=code`;
    cookie.set('destination_url', req.url, { signed: false });
    
    res.redirect(url);

  } else {
    if(authUser.expires_in <= (new Date())){
      const response = await data.getRefreshToken(authUser.refresh_token);
      const accessObject = transferCredentials(response.data);
      cookie.set('authenticatedUser', accessObject, { signed: false });
      authUser = cookie.get('authenticatedUser', { signed: false });
    }
  }
  res.locals.yahooCredentials = authUser;
  next();
});



function transferCredentials(responseObj){
    const curDateTime = new Date();
    const accessObj = {};
      accessObj.access_token = responseObj.access_token; //'RvP9Y9Kfug0cIKb1HZpGASDvaIuuWEttO0yRn4NkIMaSKop32Ksfnp7an6ennNFmwM0tcf2gaDRuoiHUizkakPhfWXwndO8X8iY.fbEBdocsqADP8sROFg1IYlw7pYwGZYJosR33qEhomSL9_eXfZT8dAfKWcsNyteY_gYyHdPOlqboWChwZD2mqM24hus2WU4ne.3Sxy4uv2zVWc21yOgfNZdBLEruBXrdAee_FYPdmLwoUXIbtOgXEWH6SOhtas06wExrvwnpfGXVldv7esDBvTFha2xXhOejnogalzY7XzoKuEaWs3VHPVX2ueuCEZ4H3wg_IJYeFD6pYRgwcQozRQAB_OUuzwnWD4vba04TABcfqR6EEbIfyqC1eg0ZNuYVz4EYpiISk01O8P_h.kKYEW6aa.xyvcMK45Ug0yzq2KTSDJV9u3wob17A8vs8H3DLyFUOGq6U_SpQk38.koCEubSVBNpSbBcJBYWJ_oRF1XoEuQyr5FCMszesOxkeH1HYGPHs0GhUXqhIb6Z8MQNrkpUZdky_Vk87vSp6vqiuQnDM1bxe.q.e2jwAunxQBZUeCfVePm_VYQTZJqQtqFhm4NVZ3X2EimOZZH40Y9jjNTkzrUBxQnSBRFBBARVGdViKZ2mi1u2Hqb4hGH1e8ngbhtoXC7uIXRwW.NQ3uPbc0dgNq0Cls16ApIKQdl8BZAB4M8w6Xgls_2YOBoL0TcwtSdHnosmBEh9y7RHoP2Z5j18KCITUkuJTky2.xvqJyL11Q9gRJhN0LG1Jhwax7Rkksqh7nH7Vy3atZ4lSsXiBEcFVhEMOlvQWA3Op5Ea90O3EpG3BcaHARjUunEQOvrJPHSkZvxEwDgOJmaiHbhBvH1jh.zHFAIuX6gzcbM7mDU2nNdt1.V5LjpEo1tAhKhJWYhID8wvVLiuiFnj1CHcwUoDEvQ7P_cBtnAqn6sywhzuQCvmIcIL1ESqQkkxM1Izff13JP4KacOIbqCu7eFw5jIY5L.8YptmFG0w--';
      accessObj.refresh_token = responseObj.refresh_token;  //'ADrOlWDkJmqHR_ybNvdQVwUgMGd5J1qKYqWL2GkWbAbZV3TqhBS5';
      accessObj.expires_in = dt.addSeconds(curDateTime, responseObj.expires_in); //3600;
      accessObj.token_type = responseObj.token_type; //'bearer';
      return accessObj;
}



app.get('/', (req, res) => {
  res.render('index.html' );
});




app.get('/:pageName', (req, res) => {
  res.end;
});

app.use('/err', (req, res, next) => {
    const err = new Error('That server blowed up real good!! We got problems boss.');
    err.status = 500;
    next(err);
  })

app.use('*',(req, res, next) => {
    const err = new Error(`Bummer, the page: "${req.baseUrl}" is gone. Just up and left!!`);
    err.status = 404;
    next(err);
  })
  
  app.use((err, req, res, next) => {
      res.locals.error = err;
      res.status(err.status);
//      console.error(req.url);
//      console.dir(err);
      if (err.status == 404) {
        res.render('page-not-found');
      } else {
        err.status = 500;
        res.json(err);
      }
  })

var httpServer = http.createServer(app);

const httpPort = 3000;
const httpsPort = 4000;

httpServer.listen(httpPort, () => {
    console.log(`The http server is running on port: ${httpPort}`);
});

https.createServer(httpsOptions, app).listen(httpsPort, () => {
    console.log(`The https server is running on port: ${httpsPort}`);
});



app.get('/Delete---------/auth', (req, res) => {
  const url = `${config.yahoo.auth_url}request_auth?client_id=${config.yahoo.app_key}&redirect_uri=${config.yahoo.redirect_uri}&response_type=code`;
  res.redirect(url);
});
app.get('/Delete---------authRedirect', async (req, res) => {
  const authToken = req.query.code;
  
  const response = await data.getAccessToken(authToken);
  const accessObj = {};
  accessObj.access_token = 'RvP9Y9Kfug0cIKb1HZpGASDvaIuuWEttO0yRn4NkIMaSKop32Ksfnp7an6ennNFmwM0tcf2gaDRuoiHUizkakPhfWXwndO8X8iY.fbEBdocsqADP8sROFg1IYlw7pYwGZYJosR33qEhomSL9_eXfZT8dAfKWcsNyteY_gYyHdPOlqboWChwZD2mqM24hus2WU4ne.3Sxy4uv2zVWc21yOgfNZdBLEruBXrdAee_FYPdmLwoUXIbtOgXEWH6SOhtas06wExrvwnpfGXVldv7esDBvTFha2xXhOejnogalzY7XzoKuEaWs3VHPVX2ueuCEZ4H3wg_IJYeFD6pYRgwcQozRQAB_OUuzwnWD4vba04TABcfqR6EEbIfyqC1eg0ZNuYVz4EYpiISk01O8P_h.kKYEW6aa.xyvcMK45Ug0yzq2KTSDJV9u3wob17A8vs8H3DLyFUOGq6U_SpQk38.koCEubSVBNpSbBcJBYWJ_oRF1XoEuQyr5FCMszesOxkeH1HYGPHs0GhUXqhIb6Z8MQNrkpUZdky_Vk87vSp6vqiuQnDM1bxe.q.e2jwAunxQBZUeCfVePm_VYQTZJqQtqFhm4NVZ3X2EimOZZH40Y9jjNTkzrUBxQnSBRFBBARVGdViKZ2mi1u2Hqb4hGH1e8ngbhtoXC7uIXRwW.NQ3uPbc0dgNq0Cls16ApIKQdl8BZAB4M8w6Xgls_2YOBoL0TcwtSdHnosmBEh9y7RHoP2Z5j18KCITUkuJTky2.xvqJyL11Q9gRJhN0LG1Jhwax7Rkksqh7nH7Vy3atZ4lSsXiBEcFVhEMOlvQWA3Op5Ea90O3EpG3BcaHARjUunEQOvrJPHSkZvxEwDgOJmaiHbhBvH1jh.zHFAIuX6gzcbM7mDU2nNdt1.V5LjpEo1tAhKhJWYhID8wvVLiuiFnj1CHcwUoDEvQ7P_cBtnAqn6sywhzuQCvmIcIL1ESqQkkxM1Izff13JP4KacOIbqCu7eFw5jIY5L.8YptmFG0w--';
  accessObj.refresh_token = 'ADrOlWDkJmqHR_ybNvdQVwUgMGd5J1qKYqWL2GkWbAbZV3TqhBS5';
  accessObj.expires_in = 3600;
  accessObj.token_type = 'bearer';
  Cookies.set('authenticatedUser', JSON.stringify(accessObj), {expires: 1});

  const accessObjedt = response.data; 
  console.log('my access element -----------------------------')

  res.end();
});
