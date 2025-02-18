export const groupPaths = {
    '/users/chat/group': {
        post: {
            tags: ['group'],  // Added tag
            summary: 'Create a new group',
            description: 'Allows an authenticated user to create a new group.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', description: 'Name of the group', example: 'Tech Enthusiasts' },
                                description: { type: 'string', description: 'Description of the group', example: 'A group for technology lovers' },
                                private:{type :'boolean',example: 'false'}
                            },
                            required: ['groupName'],
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Group successfully created',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    groupId: { type: 'string', description: 'Unique ID of the created group' },
                                    groupName: { type: 'string', description: 'Name of the group' },
                                },
                            },
                        },
                    },
                },
                400: { description: 'Invalid input or missing fields' },
                401: { description: 'Unauthorized' },
                500: { description: 'Internal server error' },
            },
        },
        get: {
            tags: ['group'],  // Added tag
            summary: 'Get all groups',
            description: 'Retrieves all the groups the authenticated user is a part of.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Successfully fetched all groups',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        groupId: { type: 'string', description: 'Unique ID of the group' },
                                        groupName: { type: 'string', description: 'Name of the group' },
                                        description: { type: 'string', description: 'Description of the group' },
                                        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp of the group' },
                                    },
                                },
                            },
                        },
                    },
                },
                401: { description: 'Unauthorized' },
                500: { description: 'Internal server error' },
            },
        },
    },

    '/users/chat/group/{id}': {
        post: {
            tags: ['group'],  // Added tag
            summary: 'Send a message to a group',
            description: 'Sends a message to a specific group identified by its ID.',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID of the group to send the message to',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                msg: { type: 'string', description: 'Message content to send to the group', example: 'Hey everyone, let\'s meet at 3pm!' },
                            },
                            required: ['msg'],
                        },
                    },
                },
            },
            responses: {
                200: { description: 'Message successfully sent to the group' },
                400: { description: 'Invalid message content' },
                401: { description: 'Unauthorized' },
                404: { description: 'Group not found' },
                500: { description: 'Internal server error' },
            },
        },
    },

    '/users/chat/group/member/{id}': {
        post: {
            tags: ['group'],  // Added tag
            summary: 'Add a member to a group',
            description: 'Adds a new member to the group identified by its ID.',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID of the group to which a member will be added',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                memberEmail: { type: 'string', description: 'Email of the member to be added', example: 'newmember@example.com' },
                            },
                            required: ['memberEmail'],
                        },
                    },
                },
            },
            responses: {
                200: { description: 'Member successfully added to the group' },
                400: { description: 'Invalid email or member already in the group' },
                401: { description: 'Unauthorized' },
                404: { description: 'Group or member not found' },
                500: { description: 'Internal server error' },
            },
        },
    },
};