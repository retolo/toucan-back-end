import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import authRouter from './routers/auth.js';
import { getEnvVar } from './utils/getEnvVar.js';
import cookieParser from 'cookie-parser';
const PORT = Number(getEnvVar('PORT'), 3000);
export const startServer = () =>{
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors());

    app.use(
        pino({
            transport: {
                target: 'pino-pretty'
            }
        })
    );

    app.use(authRouter);

    app.get('/', (req, res) =>{
        res.json({
            message: 'Hello toucan'
        });
    });



    app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
    });



};
