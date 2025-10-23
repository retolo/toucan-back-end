import createHttpError from 'http-errors';
import {UserCollection} from '../db/models/user.js';
import {SessionCollection} from '../db/models/session.js'
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { THIRTY_DAYS, FIFTEEN_MINUTES} from "../constants/index.js";

export const registerUser = async (payload) =>{
    const user = await UserCollection.findOne({email: payload.email});


    if(user){
        throw createHttpError(409, 'Email in use');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);


    return await UserCollection.create({
        email: payload.email,
        password: encryptedPassword
    })
}



export const loginUser = async (payload) =>{
    const user = await UserCollection.findOne({email: payload.email});



    if(!user){
        throw createHttpError(409, 'Email not found')
    }

    const isEqual = await bcrypt.compare(payload.password, user.password);
    console.log(isEqual)
    if(!isEqual){
        throw createHttpError(401, 'Unauthorized')
    }

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    await SessionCollection.deleteOne({userId: user._id});

    return await SessionCollection.create({
        sessionId: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    })
}


export const logout = async (sessionId) =>{
    await SessionCollection.deleteOne({_id: sessionId});
}

