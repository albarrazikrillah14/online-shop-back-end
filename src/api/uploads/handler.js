const path = require('path');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    this.getUploadImageHandler = this.getUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { image } = request.payload;
      this._validator.validateImageHeaders(image.hapi.headers);

      const fileLocation = await this._service.writeFile(image, image.hapi);

      const response = h.response({
        status: 'success',
        data: {
          fileLocation,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return error.message;
    }
  }

  async getUploadImageHandler(request) {
    const { filename } = request.params;


    const result =  await this._service.readFile(filename);

    return {
      status: 'succes',
      data: {
        image: result,
      }
    }
  }
}

module.exports = UploadsHandler;