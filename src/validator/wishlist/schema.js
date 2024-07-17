const Joi = require("joi");

const PostWishlistPayloadSchema = Joi.object({
  orderQuantity: Joi.number().integer().required(),
  productId: Joi.string().required(),
});

const PutWishlistPayloadSchema = Joi.object({
  orderQuantity: Joi.number().integer().required(),
});

module.exports = { PostWishlistPayloadSchema, PutWishlistPayloadSchema };