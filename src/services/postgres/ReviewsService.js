const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class ReviewsService {
  constructor() {
    this._pool = new Pool();
  }

  async addReview(rating, comment, productId, ownerId) {
    const id = `review-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO reviews(id, rating, comment, product_id, user_id) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, rating, comment, productId, ownerId]
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new InvariantError('Gagal menambahkan reviews');
    }

    return result.rows[0].id;
  }

  async getReviews(productId) {
    const query = {
      text: 'SELECT reviews.id, reviews.rating, reviews.comment, users.fullname as owner FROM reviews JOIN users ON reviews.user_id = users.id WHERE reviews.product_id = $1',
      values: [productId]
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ReviewsService;