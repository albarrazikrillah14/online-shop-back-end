class WishlistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postWishlistHandler = this.postWishlistHandler.bind(this);
    this.putWishlistByIdHandler = this.putWishlistByIdHandler.bind(this);
    this.deleteWishlistByIdHandler = this.deleteWishlistByIdHandler.bind(this);
    this.getWishlistHandler = this.getWishlistHandler.bind(this);
    this.getWishlistByIdhandler = this.getWishlistByIdhandler.bind(this);
  }

  async postWishlistHandler(request, h) {
    this._validator.validatePostWishlistPayload(request.payload);

    const { orderQuantity, productId } = request.payload;
    const { id: userId } = request.auth.credentials;

    const wishlistId = await this._service.addWishlist(userId, productId, orderQuantity);

    const response = h.response({
      status: 'success',
      data: {
        wishlistId,
      }
    });

    response.code(201);
    return response;
  }

  async putWishlistByIdHandler(request) { 
    this._validator.validatePutWishlistPayload(request.payload);

    const { id: wishlisthId } = request.params;
    const {id: ownerId } = request.auth.credentials;
    await this._service.verifyWishlistOwner(wishlisthId, ownerId);

    const { orderQuantity } = request.payload;

    await this._service.editWishlistById(wishlisthId, { orderQuantity });

    return {
      status: 'success',
      message: 'Berhasil mengubah wishlist',
    };
  }

  async deleteWishlistByIdHandler(request) {
    const { id: wishlisthId } = request.params;
    const {id: ownerId } = request.auth.credentials;
    await this._service.verifyWishlistOwner(wishlisthId, ownerId);

    await this._service.deleteWishlistById(wishlisthId);

    return {
      status: 'success',
      message: 'Berhasil menghapus wishlist'
    };
   }

   async getWishlistHandler(request) {
      const { id: ownerId } = request.auth.credentials;
      const wishlist = await this._service.getWishlist(ownerId);

      return {
        status: 'success',
        data: {
          wishlist,
        }
      };
   }

   async getWishlistByIdhandler(request) {
    try {
      const { id: wishlisthId } = request.params;
    const {id: ownerId } = request.auth.credentials;
    await this._service.verifyWishlistOwner(wishlisthId, ownerId);

    const wishlist = await this._service.getWishlistById(wishlisthId);

    return {
      status: 'success',
      data: {
        wishlist
      }
    };
    } catch (error) { return error.message };
   }
}

module.exports = WishlistHandler;