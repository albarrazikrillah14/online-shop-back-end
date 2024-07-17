exports.up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    price: {
      type: 'INTEGER',
      notNull: true,
      default: 0,
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    images: {
      type: 'TEXT []',
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
  pgm.dropTable('products');
};
