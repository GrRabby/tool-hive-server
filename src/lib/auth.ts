import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { getAuthDb } from "../config/db"


export const auth = betterAuth({
    database: mongodbAdapter(getAuthDb()),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.CLIENT_URL!],
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
    },
    advanced: {
        defaultCookieAttributes: {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        },
    },
    plugins: [admin()],
});

export type Session = typeof auth.$Infer.Session;