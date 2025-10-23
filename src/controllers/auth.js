import { registerUser, loginUser, logout} from "../services/auth.js";
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

    res.cookie('sessionId', session._id, {
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
            accessToken: session.accessToken
        }
    })
}


export const logoutController = async (req, res) =>{


    if(req.cookies.sessionId){
        await logout(req.cookies.sessionId);
    }

    res.status(204).send();
}
