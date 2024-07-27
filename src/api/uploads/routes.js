const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/images',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
      },
      auth: process.env.JWT_SCEMA_NAME
    },
  },
  {
    method: 'GET',
    path: '/upload/{filename}',
    handler: handler.getUploadImageHandler,
  },

];
 
module.exports = routes;