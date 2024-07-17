const InvariantError = require("../../exceptions/InvariantError");
const { PutWishlistPayloadSchema, PostWishlistPayloadSchema } = require("./schema");

const WishlistValidator = {
  validatePostWishlistPayload: (payload) => {
    const validationResult = PostWishlistPayloadSchema.validate(payload);
    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutWishlistPayload: (payload) => {
    const validationResult = PutWishlistPayloadSchema.validate(payload);
  }
}

module.exports = WishlistValidator;