const Joi = require("joi");

const ReviewPayloadSchema = Joi.object({
  rating: Joi.number().integer().required(),
  comment: Joi.string().required(),
});

module.exports = ReviewPayloadSchema;