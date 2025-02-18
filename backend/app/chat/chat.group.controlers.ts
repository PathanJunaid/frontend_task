import asyncHandler from "express-async-handler";
import {  type Request, type Response } from 'express'
import * as chatServices from "./chat.services";
import * as chatDb from '../prisma/prisma'
import { createResponse } from "../common/helper/response.hepler";
import { IGroup } from "./chat.dto";

export const createGroup = asyncHandler(async(req:Request, res:Response)=>{
    const token = req.cookies['access_token'];
    const user = await chatServices.getAdmin(token);
    const data: IGroup = {
        name: req.body.name,         // Assign name directly
        description: req.body.description,  // Assign description directly
        private: req.body?.private     // Assign private directly
    };
    const result = await chatDb.createGroup(data,user.id)
    res.send(createResponse([result],"Success"));
})
export const getallGroups = asyncHandler(async(req:Request, res:Response)=>{
    const token = req.cookies['access_token'];
    const user = await chatServices.getAdmin(token);
    const result = await chatDb.getGroups(user.id)
    res.send(createResponse(result,"Success"));
})
export const sendgroupMsg = asyncHandler(async(req:Request, res:Response)=>{
    const {id} = req.params;
    const token = req.cookies['access_token'];
    const user = await chatServices.getAdmin(token);
    if(await chatDb.checkadmin(id,user.id) || await chatDb.checkmember(id,user.id)){
        const result = await chatDb.sendgroupMsg(user.email, id, req.body.msg)
        res.send(createResponse([result],"Success"));
        return
    }else{
        res.send(
            {
                data: [],
                msg: "not authenticated",
                success : false
            }
        );
    }
})
export const addMember = asyncHandler(async(req:Request, res:Response)=>{
    const {id} = req.params;
    const member = await chatDb.getUserByEmail(req.body.email)
    if(!member){
        res.send(createResponse([],"failed"))
        return;
    }
    const result = await chatDb.addsingleusertoGroup(id, member.id)
    res.send(createResponse([result],"Success"));
})