
import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { auth } from "./lib/auth.js";
import { get_API_DB } from "./config/db.js";
import { toNodeHandler } from "better-auth/node";
import toolRoutes from "./routes/toolRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
        exposedHeaders: ["set-auth-token", "set-auth-jwt"],
    })
);


app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/api/tools", toolRoutes);
app.use("/api/admin", adminRoutes);
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