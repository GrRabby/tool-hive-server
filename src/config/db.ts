import mongoose from "mongoose";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const geturi = (): string => {
    const uri = process.env.MONGO_URI;
    if(!uri){
        console.log("Mongo URI is not defined")
        process.exit(1);
    }
    return uri;
}


export const mongoClient = new MongoClient(geturi());
export const getAuthDb = () => mongoClient.db("tool-hive") // for better auth 

export const get_API_DB = async (): Promise<void> => {
    try{
        await mongoClient.connect();
        await mongoose.connect(geturi(), {
            dbName : 'tool-hive'
        }); // for api calls
    }catch(error){
        console.log("MongoDb connection failed", error)
        process.exit(1)
    }
}