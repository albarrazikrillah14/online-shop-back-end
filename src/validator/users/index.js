const InvariantError = require("../../exceptions/InvariantError");
const { UserPayloadSchema, ProfilePayloadSchema } = require("./schema")

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateProfilePayload: (payload) => {
    const validationResult = ProfilePayloadSchema.validate(payload);
    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = UsersValidator;