import 'server-only'

import { JWTPayload, SignJWT, jwtVerify } from "jose"


const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET
);


export interface OrderJwtPayload {
    orderId: string | null,
    userId: string | null,
    [key: string]: unknown;
}

export async function verifyToken<T extends JWTPayload>(token: string): Promise<T | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY, {
            algorithms: ["HS256"],
        });


        return payload as T;
    } catch (error: any) {
        return null;
    }
}


export async function createJwt<T extends JWTPayload>(payload: T): Promise<string> {

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" }) // Define the signing algorithm
        .setIssuedAt()                        // iat claim (current time)
        .setExpirationTime("20m")              // exp claim (expires in 20 mins)
        .sign(SECRET_KEY);                    // Sign with the encoded key


    return token
}

