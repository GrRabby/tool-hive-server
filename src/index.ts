
import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { get_API_DB } from "./config/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


// if none of the routes are reached from above
app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong on the server" });
});

const start =  async():Promise<void> => {
    await get_API_DB();
    app.listen(PORT, () => {
        console.log('Server started')
    })
}
start();