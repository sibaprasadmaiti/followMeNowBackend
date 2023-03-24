const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const path = require("path");
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const basicAuth = require('express-basic-auth');

const app = express();


/**************** Swagger Definition ***************/
const swaggerOptions = {
  definition:{
    openapi:'3.0.3',
      info: {
        title: 'followmenow-API',
        version: '1.0.0',
        description: 'Charge KW API Documentation.',
        contact: {
          email: 'ahin.subhra.das@weavers-web.com'
        },
        license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
        }
      },
        components: {
          securitySchemes: {
            "Bearer": {
              "type": "apiKey",
              "name": "Authorization",
              "in": "header"
          }
          }
      },
      security: [
          {
            Bearer: []
          }
      ],
      servers: [
          {
            'url': 'http://172.105.49.96:3005/v1',
            'description':'This url is for staging server'
          },
          {
             'url': 'http://localhost:3000/v1',
             'description':'This url is for local server'
          }
      ],
  },
  apis:['src/routes/v1/*.js','src/routes/v1/user/*.js']
};
//**Initializing swagger with configuration and routes */

// const options = {
//   swaggerDefinition,
//   apis: ["./routes/v1/auth.route.js"],
// };
const swaggerDocs = swaggerJsDoc(swaggerOptions);

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// app.use(express.json());
// parse json request body
// app.use(express.json());
app.use(express.json({ limit: '500mb' }));

// parse urlencoded request body
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({
  extended: true,
  limit: '500mb',
  parameterLimit: 1000000000000
}));

app.use(express.static(path.join(__dirname, "./public")));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));


// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// Swagger Api.
app.use("/api-docs",basicAuth({users: { [process.env.USERNAMESUI]:process.env.PASSWORDSUI }, challenge: true }), swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
