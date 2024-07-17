const ForbiddenError = require("../../exceptions/ForbiddenError");
const InvariantError = require("../../exceptions/InvariantError");
const { ProductPayloadSchema, GetProductsQuerySchema } = require("./schema")

const ProductsValidator = {
  validateProductPayload: (payload) => {
    const validationResult = ProductPayloadSchema.validate(payload);
    
    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAccessProduct: (roleId) => {
    const match = roleId === 1;

    if(!match) {
      throw new ForbiddenError('Anda tidak memiliki hak');
    }
  },

  validateGetProductsQuery: (payload) => {
    const validationResult = GetProductsQuerySchema.validate(payload);

    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = ProductsValidator;