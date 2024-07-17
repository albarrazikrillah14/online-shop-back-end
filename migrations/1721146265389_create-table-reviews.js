exports.up = (pgm) => {
  pgm.createTable('reviews', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    rating: {
      type: 'INTEGER',
      notNull: true,
      default: 0,
    },
    comment: {
      type: 'TEXT',
      notNull: true,
    },
    product_id: {
      type: 'VARCHAR(100)',
      notNull: true,
      references: 'products(id)',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'VARCHAR(100)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE'
    }
  });
};
exports.down = (pgm) => {
  pgm.dropTable('reviews');
};
