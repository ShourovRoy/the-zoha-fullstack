import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionPayload extends JWTPayload {
    userId: string
    role: string
    expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload as SessionPayload
    } catch (error) {

        return undefined
    }
}


export async function createSession(userId: string, role: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt, role })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.APP_STATUS === "PRODUCTION",
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}


export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function getUser(isRedirectRequired: boolean = true): Promise<SessionPayload | undefined | null> {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    console.log("session: ", session)
    if ((!session || !session?.value) && isRedirectRequired) {
        console.log("redirection from session missing ")
        redirect("/auth/login")

    }

    const user: SessionPayload | undefined = await decrypt(session?.value!)
    if (!user && isRedirectRequired) {

        console.log("redirection from user missing ")
        redirect("/")
    }

    return user || null
}