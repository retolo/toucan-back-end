import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";


export const initMongoDb = async () =>{

    try {
        const pwd = getEnvVar('MONGODB_PASSWORD')
        const user = getEnvVar('MONGODB_USER')
        const db = getEnvVar('MONGODB_DB')
        const url = getEnvVar('MONGODB_URL');


        await mongoose.connect(
            `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`
        );
        console.log('Mongo connection successfully established!')
    } catch (error) {
        console.log('Error while setting up mongo connection', error);
        throw error;
    }


}
