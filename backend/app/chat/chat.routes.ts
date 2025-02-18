import express from 'express';
import groupRoutes from './chat.group.routes';
import * as chatValidations from './chat.validations';
import * as chatControllers from './chat.controllers';
import * as authControllers from '../common/auth/auth.controller';
import { catchError } from '../common/middleware/cath-error.middleware';

const chatRoutes = express.Router();
chatRoutes.use('/group',groupRoutes)
chatRoutes.use((req, res, next) => {
    console.log('Request received at /api/users/chat', req.method, req.path);
    next();
  });
chatRoutes
    // send msg payload recieverEmail, msg
    .get('/get', authControllers.authverify, chatControllers.getmsgofUser)
    .post('/', authControllers.authverify, chatValidations.sendmsg, catchError, chatControllers.sendmsg)
    // .get('/')
    
export default chatRoutes;
