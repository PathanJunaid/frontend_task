/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for a user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was last updated
 *       required:
 *         - name
 *         - email
 *         - createdAt
 *         - updatedAt
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     description: Returns a list of users from the system. Requires authentication.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user. Requires authentication and validates input.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a specific user by ID
 *     description: Fetch a user based on their unique ID. Requires authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a specific user by ID
 *     description: Deletes a user based on their unique ID. Requires authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 */


export const userPaths = {
    '/users': {
      get: {
        summary: 'Retrieve a list of all users',
        description: 'Returns a list of users from the system. Requires authentication.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Successfully fetched the list of users',
            content: {
              'application/json': {
                // Add the response schema here if necessary
              },
            },
          },
          401: { description: 'Unauthorized, invalid token' },
          500: { description: 'Internal server error' },
        },
      },
      post: {
        summary: 'Create a new user',
        description: 'Creates a new user. Requires authentication and validates input.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  active: { type: 'boolean' },
                },
                required: ['name', 'email', 'password'],
              },
            },
          },
        },
        responses: {
          201: { description: 'User successfully created' },
          400: { description: 'Invalid input' },
          401: { description: 'Unauthorized, invalid token' },
          500: { description: 'Internal server error' },
        },
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Retrieve a specific user by ID',
        description: 'Fetch a user based on their unique ID. Requires authentication.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID of the user to retrieve',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Successfully fetched user details',
            content: {
              'application/json': { schema: { $ref: '/components/schemas/User' } }, // Reference to the User schema
            },
          },
          404: { description: 'User not found' },
          401: { description: 'Unauthorized, invalid token' },
          500: { description: 'Internal server error' },
        },
      },
      delete: {
        summary: 'Delete a specific user by ID',
        description: 'Deletes a user based on their unique ID. Requires authentication.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID of the user to delete',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'User successfully deleted' },
          404: { description: 'User not found' },
          401: { description: 'Unauthorized, invalid token' },
          500: { description: 'Internal server error' },
        },
      },
    },
    '/users/login': {
      post: {
        summary: 'Login to the system',
        description: 'Authenticate a user using email and password.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful, returns authentication token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          400: { description: 'Invalid email or password' },
          401: { description: 'Unauthorized' },
          500: { description: 'Internal server error' },
        },
      },
    },
    '/users/logout': {
      post: {
        summary: 'Logout of the system',
        description: 'Logs out the user by invalidating their session or token.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Successfully logged out',
          },
          401: {
            description: 'Unauthorized, invalid token',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },
  };
  
  
  // Define the 'User' schema under components
  
  