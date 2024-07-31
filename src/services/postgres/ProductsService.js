const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class ProductsService {
  constructor() {
    this._pool = new Pool();
  }

  async addProduct(name, price, description, images, ownerId) {
    const id = `product-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO products(id, name, price, description, images, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, name, price, description, images, ownerId]
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new InvariantError('Gagal menambahkan produk');
    }

    return result.rows[0].id;
  }

  async editProduct(id, { name, price, description, images, ownerId }) {
    const query = {
      text: 'UPDATE products SET name = $1, price = $2, description = $3, images = images || $4, user_id = $5 WHERE id = $6 RETURNING id',
      values: [name, price, description, images, ownerId, id]
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new NotFoundError('produk tidak ditemukan');
    }
  }

  async deleteProduct(id) {
    const query = {
      text: 'DELETE FROM products WHERE id = $1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new NotFoundError('produk tidak ditemukan');
    }
  }

  async getProducts(limit = 10, offset = 0) {
    const query = {
      text: 'SELECT p.id, p.name, p.price, p.description,  p.images, COALESCE(ROUND(AVG(reviews.rating), 2), 0) as rating FROM products as p  LEFT JOIN reviews ON p.id = reviews.product_id GROUP BY p.id LIMIT $1 OFFSET $2',
      values: [limit, offset]
    }
    const result = await this._pool.query(query);

    return result.rows;
  }
  async getCountProducts() {
    const result = await this._pool.query('SELECT COUNT(id) as count FROM products');
    return result.rows[0];
  }

  async getProductById(id) {
    const query = {
      text: 'SELECT p.id, p.name, p.price, p.description,  p.images, COALESCE(ROUND(AVG(reviews.rating), 2), 0) as rating FROM products as p  LEFT JOIN reviews ON p.id = reviews.product_id WHERE p.id = $1 GROUP BY p.id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw  new NotFoundError('Produk tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyProductExist(id) {
    const query = {
      text: 'SELECT id FROM products WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw  new NotFoundError('Produk tidak ditemukan');
    }
  }

}

module.exports = ProductsService;