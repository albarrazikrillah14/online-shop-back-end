const InvariantError = require("../../exceptions/InvariantError");
const ReviewPayloadSchema = require("./schema")

const ReviewsValidator = {
  validateReviewPayload: (payload) => {
    const validationResult = ReviewPayloadSchema.validate(payload);

    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = ReviewsValidator;