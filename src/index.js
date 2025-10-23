import { startServer } from "./server.js";
import { initMongoDb } from "./db/initMongoDb.js";

async function bootServer(){
    await initMongoDb();
    startServer();
}


bootServer();
