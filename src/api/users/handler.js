class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserHandler = this.getUserHandler.bind(this);
    this.putUserHandler = this.putUserHandler.bind(this);
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

  async getUserHandler(request) {

    try {
      const { id: userId } = request.auth.credentials;

    const data = await this._service.getProfile(userId);

    return {
      status: 'success',
      data,
    }
    } catch (e) { return e.message }
  }

  async putUserHandler(request) {
    try {
      this._validator.validateProfilePayload(request.payload);

    const { id: userId } = request.auth.credentials;

    await this._service.editProfile(userId, request.payload);

    return {
      status: 'success',
      message: 'berhasil mengubah profile',
    }
    } catch (e) { return e.message }
  }
}

module.exports = UsersHandler;