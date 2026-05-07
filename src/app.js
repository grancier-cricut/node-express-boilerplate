const express = require('express');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const { status: httpStatus } = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { createWasmStaticMiddleware } = require('./wasmStatic');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

const sanitizeMongoRequest = (req, res, next) => {
  ['body', 'params', 'headers'].forEach((key) => {
    if (req[key]) {
      req[key] = mongoSanitize.sanitize(req[key]);
    }
  });

  // Express 5 exposes req.query through an accessor, so replace it with the sanitized value.
  Object.defineProperty(req, 'query', {
    value: mongoSanitize.sanitize(req.query),
    writable: false,
    configurable: true,
    enumerable: true
  });

  next();
};

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(sanitizeMongoRequest);

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('/{*path}', cors());

// serve WebAssembly artifacts without requiring auth
app.use('/wasm', createWasmStaticMiddleware());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
