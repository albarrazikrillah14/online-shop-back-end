require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

//Error
const ClientError = require('./exceptions/ClientError');

//users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

//authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');

//products
const products = require('./api/products');
const ProductsService = require('./services/postgres/ProductsService');
const ProductsValidator = require('./validator/products');

//reviews
const reviews = require('./api/reviews');
const ReviewsService = require('./services/postgres/ReviewsService');
const ReviewsValidator = require('./validator/reviews');

//wishlist
const wishlist = require('./api/wishlist');
const WishlistService = require('./services/postgres/WishlistService');
const WishlistValidator = require('./validator/wishlist');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const productsService = new ProductsService();
  const reviewsService = new ReviewsService();
  const wishlistService = new WishlistService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = new Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    },
  });

  await server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        status: 'success',
        message: 'hi, from medomeckz',
      }
    },
  });

  //External
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  await server.auth.strategy(process.env.JWT_SCEMA_NAME, 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        email: artifacts.decoded.payload.email,
        roleId: artifacts.decoded.payload.roleId,
      }
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationsService,
        usersService: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      }
    },
    {
      plugin: products,
      options: {
        service: productsService,
        validator: ProductsValidator,
      }
    },
    {
      plugin: reviews,
      options: {
        service: reviewsService,
        validator: ReviewsValidator,
      }
    },
    {
      plugin: wishlist,
      options: {
        service: wishlistService,
        productsService: productsService,
        validator: WishlistValidator,
      }
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });

      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(server.info.uri);
};

init();