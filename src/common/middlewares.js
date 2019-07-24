//add here any middlewares for all your enpoints and API

var bodyParser = require('body-parser')
const jwt = require('./jwt')
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
]