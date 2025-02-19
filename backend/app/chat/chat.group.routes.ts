import express from 'express';
import * as chatValidations from './chat.validations';
import * as groupControllers from './chat.group.controlers';
import * as authControllers from '../common/auth/auth.controller';
const groupRoutes  = express.Router();

// Group Routes 

groupRoutes
.post('/', authControllers.authverify, chatValidations.createGroup, groupControllers.createGroup)
.get('/', authControllers.authverify, groupControllers.getallGroups)
.get('/:id', authControllers.authverify, groupControllers.getChatofGroup)
.post('/:id',authControllers.authverify, groupControllers.sendgroupMsg)
.get('/member/:id',authControllers.authverify, groupControllers.getMembers)
.post('/member/:id',authControllers.authverify, groupControllers.addMember);

export default groupRoutes;