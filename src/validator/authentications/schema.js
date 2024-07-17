const Joi = require("joi");

const PostAuthenticationPayloadSchema = Joi.object({
  usernameOrEmail: Joi.alternatives().try(
    Joi.string().min(6).max(100).required(),
    Joi.string().email().required()
  ),
  password: Joi.string().required(),
});

module.exports = PostAuthenticationPayloadSchema;


const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloaSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloaSchema };
