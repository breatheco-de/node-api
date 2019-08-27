//add here any middlewares for all your enpoints and API

var bodyParser = require('body-parser')
const jwt = require('./jwt')
const utils = require('./utils');

module.exports = [
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    //autentication
    ...(jwt.middlewares),
  /*
    middlewares can go here, like
    cookieParser(),
    ...
*/
    utils.errorHandler
]