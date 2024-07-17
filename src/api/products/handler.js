class ProductsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postProductHandler = this.postProductHandler.bind(this);
    this.putProductByIdHandler = this.putProductByIdHandler.bind(this);
    this.deleteProductByIdHandler = this.deleteProductByIdHandler.bind(this);
    this.getProductsHandler = this.getProductsHandler.bind(this);
    this.getProductByIdHandler = this.getProductByIdHandler.bind(this);
  }

  async postProductHandler(request, h) {
    this._validator.validateProductPayload(request.payload);
    const { id: userId, roleId } = request.auth.credentials;
    this._validator.validateAccessProduct(roleId);


    const { name, price, description, images } = request.payload;

    const productId = await this._service.addProduct(name, price, description, images, userId);

    const response = h.response({
      status: 'success',
      data: {
        productId
      },
    });

    response.code(201);
    return response;
  }

  async putProductByIdHandler(request) {
    this._validator.validateProductPayload(request.payload);
    const { id: userId, roleId } = request.auth.credentials;
    this._validator.validateAccessProduct(roleId);

    const { id: productId } = request.params;
    const { name, price, description, images } = request.payload;
    
    await this._service.editProduct(productId, {name, price, description, images, ownerId: userId });

    return {
      status: 'success',
      message: 'produk berhasil diubah',
    };

  }

  async deleteProductByIdHandler(request) {
    const { roleId } = request.auth.credentials;
    this._validator.validateAccessProduct(roleId);

    const { id: productId } = request.params;

    await this._service.deleteProduct(productId);

    return {
      status: 'success',
      message: 'Berhasil menghapus produk',
    };
  }

  async getProductsHandler(request) {
    this._validator.validateGetProductsQuery(request.query);
    
    const { limit = 10, offset = 0 } = request.query;

    const products = await this._service.getProducts(limit, offset);

    return {
      status: 'success',
      data: {
        products
      }
    };
  }

  async getProductByIdHandler(request) {
    const { id: productId } = request.params;

    const product = await this._service.getProductById(productId);

    return {
      status: 'success',
      data: {
        product,
      }
    }
  }
}

module.exports = ProductsHandler;