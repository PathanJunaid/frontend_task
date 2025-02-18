import { body } from 'express-validator';

export const createGroup = [
    body('name').notEmpty().withMessage('name is required').isString().withMessage('name must be a string'),
    body('description').notEmpty().withMessage('description is required').isString().withMessage('description must be a string'),
];
export const sendmsg = [
    body('recieverEmail').notEmpty().withMessage('email is required').isString().withMessage('name must be a string'),
    body('msg').notEmpty().withMessage('msg is required').isString().withMessage('msg must be a string'),
]
export const getmsgs = [
    body('recieverEmail').notEmpty().withMessage('email is required').isString().withMessage('email must be a string'),
]
export const addmember = [
    body('email').notEmpty().withMessage('email is required').isString().withMessage('email must be a string'),
]