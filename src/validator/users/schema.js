const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(6).max(100).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  fullname: Joi.string().required(),
  roleId: Joi.number().integer().required(),
});

module.exports = UserPayloadSchema;