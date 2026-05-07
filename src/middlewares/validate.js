const Joi = require('joi');
const { status: httpStatus } = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = Object.keys(validSchema).reduce((accumulator, key) => {
    accumulator[key] = req[key] || {};
    return accumulator;
  }, {});
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.keys(value).forEach((key) => {
    if (key === 'query') {
      Object.defineProperty(req, 'query', {
        value: value.query,
        writable: false,
        configurable: true,
        enumerable: true,
      });
    } else {
      req[key] = value[key];
    }
  });
  return next();
};

module.exports = validate;
