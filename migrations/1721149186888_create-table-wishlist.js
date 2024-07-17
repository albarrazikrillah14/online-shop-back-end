exports.up = (pgm) => {
  pgm.createTable('wishlist', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(100)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: 'VARCHAR(100)',
      notNull: true,
      references: 'products(id)',
      onDelete: 'CASCADE',
    },
    order_quantity: {
      type: 'INTEGER',
      notNull: true,
      default: 1,
    }
  });
};
exports.down = (pgm) => {
  pgm.dropTable('wishlist');
};
