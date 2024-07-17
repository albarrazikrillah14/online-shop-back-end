exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(100)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    email: {
      type: 'VARCHAR(100)',
      unique: true,
      notNull: true,
    },
    fullname: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    role_id: {
      type: 'INTEGER',
      notNull: true,
    }
  });
  
  pgm.addConstraint('users', 'fk_users.role_id_roles.id', 'FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
