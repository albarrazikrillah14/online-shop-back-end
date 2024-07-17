const routes = (handler) => [
  {
    method: 'POST',
    path: '/reviews/{productId}',
    handler: handler.postReviewHandler,
    options: {
      auth: process.env.JWT_SCEMA_NAME
    }
  },
  {
    method: 'GET',
    path: '/reviews/{productId}',
    handler: handler.getReviewsHandler,
  }
];

module.exports = routes;