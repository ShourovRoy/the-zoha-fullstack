import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    return Response.json({
        message: "Ok from IPN route"
    })
}