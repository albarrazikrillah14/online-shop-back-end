const path = require('path');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

  async postUploadImageHandler(request, h) {
    try {
      const { image } = request.payload;
      this._validator.validateImageHeaders(image.hapi.headers);

      const fileLocation = await this._service.writeFile(image, image.hapi);

      const response = h.response({
        status: 'success',
        data: {
          fileLocation: `/upload/images/${fileLocation}`,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return error.message;
    }
  }
}

module.exports = UploadsHandler;