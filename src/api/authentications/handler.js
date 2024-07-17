class AuthenticationsHandler  {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { usernameOrEmail, password } = request.payload;

    const { data } = await this._usersService.verifyUserCredential(usernameOrEmail, password);

    const accessToken = this._tokenManager.generateAccessToken(data);
    const refreshToken = this._tokenManager.generateRefreshToken(data);

    this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        roleId: data.roleId,
      },
    });

    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    this._validator.validatePutAuthenticationPayload(request.payload);
    
    const { refreshToken }  = request.payload;
    
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const data = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken(data);

    return {
      status: 'success',
      data: {
        accessToken: accessToken
      }
    };
  }

  async deleteAuthenticationHandler(request) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);
  
    const { refreshToken }  = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    this._tokenManager.verifyRefreshToken(refreshToken);

    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;