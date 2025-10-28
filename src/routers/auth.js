import { Router } from 'express';
import { registrationSchema, loginSchema, loginWithGoogleSchema} from '../validation/auth.js';
import { registerUserController, loginUserController, logoutController, checkSessionController, generateAuthUrlController, loginWithGoogleController} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registrationSchema), registerUserController);
authRouter.post('/login', validateBody(loginSchema), loginUserController);
authRouter.post('/logout', logoutController);
authRouter.get('/check-session',  checkSessionController);
authRouter.get('/generate-oauth-url', generateAuthUrlController);
authRouter.post('/confirm-oauth', validateBody(loginWithGoogleSchema), loginWithGoogleController)
export default authRouter;
