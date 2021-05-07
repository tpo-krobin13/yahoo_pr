var fs = require('fs');
var http = require('http');
var https = require ('https');
const data = require('./data');

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


const YahooFantasy = require('yahoo-fantasy');


//const mainRoutes = require('./routes');

//app.use(mainRoutes);
// routes


function tokenCallBack(req, res) {
//  console.dir(req);
//  console.dir(res);
  res.end();
};

app.get('/auth', (req, res) => {
  const url = `${config.yahoo.auth_url}request_auth?client_id=${config.yahoo.app_key}&redirect_uri=${config.yahoo.redirect_uri}&response_type=code`;
  res.redirect(url);
});

app.get('/authenticated', (req, res) => {
//  console.log(req.body)
  res.end();
})

app.get('/', (req, res) => {
  res.render('index.html' );
});

app.get('/authRedirect', async (req, res) => {
  const authToken = req.query.code;
  
  const respon = await data.getAccessToken(authToken);
  console.log('my access element -----------------------------')
console.log(respon)

  res.end();
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
        res.render('error');
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



