class ReviewsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postReviewHandler = this.postReviewHandler.bind(this);
    this.getReviewsHandler = this.getReviewsHandler.bind(this);
  }

  async postReviewHandler(request, h) {
    this._validator.validateReviewPayload(request.payload);

    const { rating, comment } = request.payload;
    const { id: ownerId } = request.auth.credentials;
    const { productId } = request.params;

    const reviewId = await this._service.addReview(rating, comment, productId, ownerId);

    const response = h.response({
      status: 'success',
      data: {
        reviewId
      }
    });

    response.code(201);
    return response;
  }

  async getReviewsHandler(request) {
    const { productId } = request.params;

    const reviews = await this._service.getReviews(productId);

    return {
      status: 'success',
      data: {
        reviews,
      }
    };
  }
}

module.exports = ReviewsHandler;