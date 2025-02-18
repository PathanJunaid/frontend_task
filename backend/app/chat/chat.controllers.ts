import asyncHandler from "express-async-handler";
import {  type Request, type Response } from 'express'
import * as chatServices from "./chat.services";
import * as chatDb from '../prisma/prisma'
import { createResponse } from "../common/helper/response.hepler";

export const sendmsg = asyncHandler(async(req:Request, res:Response)=>{
    const token = req.cookies['access_token']
    const admin = await chatServices.getAdmin(token);
    const result = await chatDb.sendmsg(admin.email,req.body.recieverEmail,req.body.msg);
    res.send(createResponse(result, "message sent successfully"))
})
export const getmsgofUser = asyncHandler((async(req:Request,res:Response)=>{
    const token = req.cookies['access_token'];
    const admin = await chatServices.getAdmin(token);
    const result = await chatDb.getmsgsofEmail(admin.email);
    res.send(createResponse(result, "message sent successfully"))
}));