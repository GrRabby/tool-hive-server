import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { bearer } from "better-auth/plugins";
import { jwt } from "better-auth/plugins";
import { getAuthDb } from "../config/db.js"


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
            sameSite: "none",
            secure: true,
        },
    },
    plugins: [
        admin(),
        bearer(),
        jwt({
            jwt: {
                expirationTime: "7d",
                definePayload: ({ user }) => ({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }),
            },
        }),

    ],
});

export type Session = typeof auth.$Infer.Session;