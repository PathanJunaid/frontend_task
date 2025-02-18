import { decodeToken } from "../common/services/passport-jwt.service"


export const getAdmin = async(token : string)=>{
    const user = decodeToken(token);
    return user;
}