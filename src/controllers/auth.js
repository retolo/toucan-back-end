import { registerUser, loginUser, logout, checkSession} from "../services/auth.js";
import { THIRTY_DAYS } from "../constants/index.js";


export const registerUserController = async (req, res) =>{
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Succsesfully regsiter a user',
        data: {
            user: user
        }
    })
}


export const loginUserController = async (req, res) =>{
    const session = await loginUser(req.body);

    res.cookie('accessToken', session.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS)
    })

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS)
    })


    res.json({
        status: 201,
        message: 'Succsesfully login',
        data: {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken
        }
    })
}


export const logoutController = async (req, res) =>{

    // console.log(req.cookies)
    if(req.cookies.refreshToken){
        await logout(req.cookies.refreshToken);
    }

    res.status(204).send();
}


export const checkSessionController = async (req, res) =>{
    const session = await checkSession(req.cookies.refreshToken);

    res.json({
        status: 200,
        message: 'Session succssesfully found!',
        data: {
            ...session
        }
    })
}
