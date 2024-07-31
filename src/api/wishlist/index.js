const WishlistHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: 'wishlist',
  version: '1.0.0',
  register: async (server, { service, productsService, validator }) => {
    const wishlistHandler = new WishlistHandler(service, productsService, validator);

    server.route(routes(wishlistHandler));
  }
}