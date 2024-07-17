const Joi = require("joi");

const ProductPayloadSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().integer().required(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string()),
});

const GetProductsQuerySchema = Joi.object({
  limit: Joi.number().integer().required().default(10),
  offset: Joi.number().integer().required().default(0),
});

module.exports = { ProductPayloadSchema, GetProductsQuerySchema };