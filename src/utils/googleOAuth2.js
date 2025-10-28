import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import {readFile} from 'fs/promises'
import {getEnvVar} from './getEnvVar.js'
import createHttpError from 'http-errors';


const PATH_JSON = path.join(process.cwd(), 'google-oauth-toucan.json');


const oauthConfig = JSON.parse(await readFile(PATH_JSON));


const googleClient = new OAuth2Client({
    clientId: getEnvVar('CLIENT_ID'),
    clientSecret: getEnvVar('CLIENT_SECRET'),
    redirectUri: oauthConfig.web.redirect_uris[0]
})



export const generateAuthUrl =  () =>{
    return googleClient.generateAuthUrl({
        scope:[
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ]
    })
}



export const validateCode= async (code) =>{
    const response = await googleClient.getToken(code);

    if(!response.tokens.id_token){
        throw createHttpError(401, 'Unauthorized')
    }


    const ticket = await googleClient.verifyIdToken({
        idToken: response.tokens.id_token,
        audience: getEnvVar('CLIENT_ID')
    });


    return ticket;
}


export const getFullname =  (payload) =>{
    let fullName = 'Guest';

    if(payload.given_name && payload.family_name){
        fullName = `${payload.given_name}_${payload.family_name}`
    }else if(payload.given_name){
        fullName = payload.given_name;
    }


    return fullName;
}
