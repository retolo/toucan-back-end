import { Router } from 'express';
import { registrationSchema, loginSchema} from '../validation/auth.js';
import { registerUserController, loginUserController, logoutController, checkSessionController} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registrationSchema), registerUserController);
authRouter.post('/login', validateBody(loginSchema), loginUserController);
authRouter.post('/logout', logoutController);
authRouter.get('/check-session',  checkSessionController)
export default authRouter;
