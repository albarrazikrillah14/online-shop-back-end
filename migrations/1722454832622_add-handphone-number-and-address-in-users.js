exports.up = (pgm) => {
  pgm.addColumn('users', {
    phonenumber: {
      type: 'VARCHAR(20)',
    },
    address: {
      type: 'TEXT[]'
    }
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'phonenumber');
  pgm.dropColumn('users', 'address');
};
