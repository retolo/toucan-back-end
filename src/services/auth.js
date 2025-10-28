import createHttpError from 'http-errors';
import {UserCollection} from '../db/models/user.js';
import {SessionCollection} from '../db/models/session.js'
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { THIRTY_DAYS, FIFTEEN_MINUTES} from "../constants/index.js";
import { validateCode } from '../utils/googleOAuth2.js';
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
        userId: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    })
}


export const logout = async (refreshToken) =>{
    console.log(refreshToken)
    await SessionCollection.deleteOne({refreshToken: refreshToken});
}


export const checkSession = async (refreshToken) =>{

    const session = await SessionCollection.findOne({refreshToken: refreshToken});

    if(!session){
        throw createHttpError(401, 'Unauthorized')
    }


    return{
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    }
}



export const loginWithGoogle = async (code) =>{
    const loginTicket = await validateCode(code)
    const payload = loginTicket.getPayload();

    if(!payload){
        throw createHttpError(401)
    }


    let user = await UserCollection.findOne({email: payload.email});

    if(!user){
        const encryptedPassword = await bcrypt.hash(randomBytes(10).toString('hex'), 10);
        user = await UserCollection.create({
            email: payload.email,
            password: encryptedPassword
        })

    }
        const accessToken = randomBytes(30).toString('base64');
        const refreshToken = randomBytes(30).toString('base64');

    return await SessionCollection.create({
        userId: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    })
}
