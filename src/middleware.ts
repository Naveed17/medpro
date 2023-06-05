import {NextResponse} from "next/server";
import type {NextRequest} from "next/server"
import type {JWT} from "next-auth/jwt"
import {withAuth} from "next-auth/middleware"

export default withAuth(
    // @ts-ignore
    async function middleware(req: NextRequest & { nextauth: { token: JWT } }) {

        // Check Edge Config to see if the maintenance page should be shown
        const {MAINTENANCE_MODE} = process.env;
        // If in maintenance mode, point the url pathname to the maintenance page
        if (MAINTENANCE_MODE !== "0") {
            req.nextUrl.pathname = `/maintenance`
            // Rewrite to the url
            return NextResponse.rewrite(req.nextUrl)
        }

        if (req.nextUrl.pathname.startsWith('/dashboard')) {
            const {data: user} = req.nextauth.token as any;
            const medical_professional: MedicalProfessionalModel = user.medical_professional;
            if (medical_professional !== undefined && medical_professional.registrationStep < 3) {
                return NextResponse.rewrite(
                    new URL(`/edit-profile?from=${req.nextUrl.pathname}&step=${medical_professional.registrationStep}`, req.url)
                )
            }
        }
    },
    {
        callbacks: {
            authorized({req, token}) {
                if (token) return true // If there is a token, the user is authenticated
            }
        },
    }
)

export const config = {
    api: {
        externalResolver: true
    },
    matcher: ["/dashboard/:path*", "/edit-profile"]
}
