const { nanoid } = require("nanoid");
const { Pool } = require("pg");

const bcrypt = require('bcrypt');
const InvariantError = require("../../exceptions/InvariantError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const NotFoundError = require("../../exceptions/NotFoundError");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser(username, password, email, fullname, roleId) {
    await this.verifyNewUsername(username);
    await this.verifyNewEmail(email);

    const id = `user-${nanoid(16)}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users(id, username, password, email, fullname, role_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, email',
      values: [id, username, hashedPassword, email, fullname, roleId]
    };

    const result = await this._pool.query(query);
    
    return result.rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Gagal menambahkan user, username sudah digunakan');
    }
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email]
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Gagal menambahkan user, email sudah digunakan');
    }
  }

  async verifyUserCredential(usernameOrEmail, password) {
    const query = {
      text: 'SELECT id, password, email, role_id FROM users WHERE username = $1 OR email = $2',
      values: [usernameOrEmail, usernameOrEmail]
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new AuthenticationError('Kredensial yang diberikan tidak valid');
    }

    const { id, password: hashedPassword, email, role_id: roleId } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if(!match) {
      throw new AuthenticationError('Kredensial yang diberikan tidak valid');
    }

    return {
     data: {
      id: id,
      email: email,
      roleId: roleId
     }
    };
  }

  async getProfile(userId) {
    const query = {
      text: 'SELECT email, fullname, phonenumber, address FROM users WHERE id = $1',
      values: [userId]
    };

    const result = await this._pool.query(query);
    
    return result.rows[0];
  }

  async editProfile(userId, { email, fullname, phonenumber, address }) {
    const query = {
      text: 'UPDATE users SET email = $1, fullname = $2, phonenumber = $3, address = $4 WHERE id = $5 RETURNING id',
      values: [email, fullname, phonenumber, address, userId]
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new NotFoundError('user tidak ditemukan');
    }
  }
}

module.exports = UsersService;