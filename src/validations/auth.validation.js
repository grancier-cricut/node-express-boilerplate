const Joi = require('joi');
const { password, jwtToken } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required()
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required()
  })
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required().custom(jwtToken)
  })
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required().custom(jwtToken)
  })
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().required()
  })
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required().custom(jwtToken)
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required().custom(jwtToken)
  })
};

const sendVerificationEmail = {
  body: Joi.object().keys({}).unknown(false)
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
