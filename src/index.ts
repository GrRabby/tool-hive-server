
import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const start =  async():Promise<void> => {
    app.listen(PORT, () => {
        console.log('Server started')
    })
}
start();