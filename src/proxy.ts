import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/auth/session";


// specify protected and public routes
const protectedRoutes = ['/admin']
const onlyPublicRoutes = ["/auth/login", "/auth/signup"]


export default async function proxy(req: NextRequest) {
    // check if the path name or url is protected ot public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path)
    const isOnlyPublicRoute = onlyPublicRoutes.includes(path)

    // get cookie and decrypt session
    const cookie = ((await cookies()).get("session"))?.value;
    const session = await decrypt(cookie)


    // redirect to login if user not authenticated
    if (isProtectedRoute && (!session?.userId || !session)) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl))
    }

    // redirect to home page if auth user is going to only public routes like /auth/login
    if (isOnlyPublicRoute && session?.userId) {

        return NextResponse.redirect(new URL("/", req.nextUrl))

    }


    return NextResponse.next()


}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}