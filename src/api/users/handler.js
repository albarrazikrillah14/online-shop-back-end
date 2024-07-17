class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { username, password, email, fullname, roleId } = request.payload;

    const { id: userId, email: userEmail } = await this._service.addUser(username, password, email, fullname, roleId); 

    const response = h.response({
      status: 'success',
      data: {
       userId: userId,
       userEmail: userEmail
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;