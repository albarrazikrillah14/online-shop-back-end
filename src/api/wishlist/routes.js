const routes = (handler) => [
  {
    method: 'POST',
    path: '/wishlist',
    handler: handler.postWishlistHandler,
    options: {
      auth: process.env.JWT_SCEMA_NAME
    }
  },
  {
    method: 'PUT',
    path: '/wishlist/{id}',
    handler: handler.putWishlistByIdHandler,
    options: {
      auth: process.env.JWT_SCEMA_NAME,
    }
  },
  {
    method: 'DELETE',
    path: '/wishlist/{id}',
    handler: handler.deleteWishlistByIdHandler,
    options: {
      auth: process.env.JWT_SCEMA_NAME,
    }
  },
  {
   method: 'GET',
   path: '/wishlist',
   handler: handler.getWishlistHandler,
   options: {
    auth: process.env.JWT_SCEMA_NAME,
   } 
  },
  {
    method: 'GET',
    path: '/wishlist/{id}',
    handler: handler.getWishlistByIdhandler,
    options: {
      auth: process.env.JWT_SCEMA_NAME,
    }
  }
];

module.exports = routes;