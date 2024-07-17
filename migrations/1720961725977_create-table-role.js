exports.up = (pgm) => {
  pgm.createTable('roles', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(100)',
      notNull: true,
      default: 'users',
    }
  });

  pgm.sql("INSERT INTO roles (name) VALUES ('admin'), ('users')");
};

exports.down = (pgm) => {
  pgm.dropTable('roles');
};
