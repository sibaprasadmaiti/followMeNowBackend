// const express = require('express');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDefinition = require('../../docs/swaggerDef');
// const basicAuth = require('express-basic-auth');

// const router = express.Router();

// const specs = swaggerJsdoc({
//   swaggerDefinition,
//   apis: ['src/docs/*.yml', 'src/routes/v1/*.js'],
// });

// router.use('/', swaggerUi.serve);
// router.get(
//   '/',
//   basicAuth({users: { [process.env.USERNAMESUI]:process.env.PASSWORDSUI }, challenge: true }),
//   swaggerUi.setup(specs, {
//     explorer: true,
//   })
// );

// module.exports = router;
