export const chatPaths = {
    '/users/chat': {
      post: {
        tags: ['Chat'],  // Tag for grouping
        summary: 'Send a message',
        description: 'Send a message to another user. Requires authentication.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  recieverEmail: { type: 'string', description: 'Receiver email' },
                  msg: { type: 'string', description: 'Message content' },
                },
                required: ['receiverEmail', 'msg'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Message successfully sent.' },
          400: { description: 'Invalid input' },
          401: { description: 'Unauthorized' },
          500: { description: 'Internal server error' },
        },
      },
      get: {
        tags: ['Chat'],  // Tag for grouping
        summary: 'Get all messages for a user',
        description: 'Retrieves all messages for the currently authenticated user. Requires authentication.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Successfully fetched user messages' },
          401: { description: 'Unauthorized' },
          500: { description: 'Internal server error' },
        },
      },
    },
  };
  