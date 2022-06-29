import type { NextRequest } from "next/server"
import type { JWT } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import {NextResponse} from "next/server";

export default withAuth(
    // @ts-ignore
    async function middleware(req: NextRequest & { nextauth: { token: JWT } }) {
        const{ data: user } = req.nextauth.token as any;
        if(user.medical_professional !== undefined && user.medical_professional.registration_step >= 3) {
            return NextResponse.redirect(
                new URL(`/edit-profile?from=${req.nextUrl.pathname}`, req.url)
            )
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => token!!
        },
    }
)
