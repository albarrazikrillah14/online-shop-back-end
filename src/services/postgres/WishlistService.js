const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const ForbiddenError = require("../../exceptions/ForbiddenError");

class WishlistService {
  constructor() {
    this._pool = new Pool();
  }

  async addWishlist(userId, productId, orderQuantity) {

    await this.verifyWishlishAlreadyExist(productId, userId);
    
    const id = `wishlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO wishlist VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, userId, productId, orderQuantity]
    };

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new InvariantError('gagal menambahkan product ke wishlist');
    }

    return result.rows[0].id;
  }

  async editWishlistById(id, { orderQuantity }) {
    const query = {
      text: 'UPDATE wishlist SET order_quantity = $1 WHERE id = $2',
      values: [orderQuantity, id]
    };
    
    await this._pool.query(query);
  }

  async deleteWishlistById(id) {
    const query = {
      text: 'DELETE FROM wishlist WHERE id = $1',
      values: [id]
    };

    await this._pool.query(query);
  }

  async getWishlist(ownerId) {
    const query = {
      text: "SELECT wishlist.id, products.id as product_id, products.name, products.description, products.price, products.images, wishlist.order_quantity as quantity FROM wishlist JOIN products ON wishlist.product_id = products.id WHERE wishlist.user_id = $1",
      values: [ownerId]
    };

    const result = await this._pool.query(query);
    
    return result.rows;
  }

  async getWishlistById(wishlistId) {
    const query = {
      text: "SELECT wishlist.id, products.id as product_id, products.name, wishlist.order_quantity as quantity FROM wishlist JOIN products ON wishlist.product_id = products.id WHERE wishlist.id = $1",
      values: [wishlistId]
    };

    const result = await this._pool.query(query);
    
    return result.rows[0];
  }

  async verifyWishlistOwner(wishlistId, userId) {
    const query = {
      text: 'SELECT * FROM wishlist WHERE id = $1',
      values: [wishlistId]
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new NotFoundError('data tidak ditemukan');
    }

    const { user_id: ownerId } = result.rows[0];

    const match = userId == ownerId;
    
    if(!match) {
      throw new ForbiddenError('anda tidak punya hak');
    }
  }

  async verifyWishlishAlreadyExist(productId, ownerId) {
    const query = {
      text: 'SELECT id FROM wishlist WHERE product_id = $1 AND user_id = $2',
      values: [productId, ownerId]
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Anda sudah memasukkan product ke keranjang');
    }
  }
}

module.exports = WishlistService;