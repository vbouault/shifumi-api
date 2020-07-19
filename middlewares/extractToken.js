const expressJWT = require('express-jwt');
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
};

module.exports = expressJWT({
  secret: JWT_PRIVATE_KEY,
  requestProperty: 'token',
  algorithms : [ 'HS256' ],
  getToken: getTokenFromHeader,
  credentialsRequired: false
});
