import { Router } from 'express';
import { registrationSchema, loginSchema} from '../validation/auth.js';
import { registerUserController, loginUserController, logoutController} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registrationSchema), registerUserController);
authRouter.post('/login', validateBody(loginSchema), loginUserController);
authRouter.post('/logout', logoutController);
export default authRouter;
