import express from 'express';
import groupRoutes from './chat.group.routes';
import * as chatValidations from './chat.validations';
import * as chatControllers from './chat.controllers';
import * as authControllers from '../common/auth/auth.controller';

const chatRoutes = express.Router();
chatRoutes.use('/group',groupRoutes)

chatRoutes
    // send msg payload recieverEmail, msg
    .post('/', authControllers.authverify, chatValidations.sendmsg, chatControllers.sendmsg)
    .get('/', authControllers.authverify, chatValidations.getmsgs, chatControllers.getmsgofUser)
    
export default chatRoutes;
