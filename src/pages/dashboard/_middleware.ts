import type { NextRequest } from "next/server"
import type { JWT } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import {NextResponse} from "next/server";

export default withAuth(
    // @ts-ignore
    async function middleware(req: NextRequest & { nextauth: { token: JWT } }) {
        const{ data: user } = req.nextauth.token as any;
        const medical_professional : MedicalProfessionalModel = user.medical_professional;
        if(medical_professional !== undefined && medical_professional.registrationStep < 3) {
            return NextResponse.redirect(
                new URL(`/edit-profile?from=${req.nextUrl.pathname}&step=${medical_professional.registrationStep}`, req.url)
            )
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => token!!
        },
    }
)
