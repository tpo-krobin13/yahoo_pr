const data = require('../data');
const Cookies = require('cookie-parser');
const cookieParser = require('cookie-parser');
const date = require('date-and-time')

exports.checkOAuth = async (req,res, next) =>  {
  const authUser = Cookies.getJSON('authenticatedUser');

  //if the user is null authenticate them
  if(!authUser) {
    console.log(req.url)

  } else {
    // if they are authenticated validate teh token is still valid
  }

};
Cookies.getJSON('authenticatedUser') 