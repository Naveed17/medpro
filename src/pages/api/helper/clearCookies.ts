// This is an example of how to read a JSON Web Token from an API routes
import type {NextApiRequest, NextApiResponse} from "next";
import {deleteCookie, getCookies} from "cookies-next";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";


export default async function clearCookies(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (session) {
        const cookies = getCookies({req, res});
        const cookiesKeys = Object.keys(cookies);
        cookiesKeys.forEach((key: string) => deleteCookie(key, {req, res}));
        res.send({
            message: "Clear all Cookies",
            cookies: JSON.stringify(cookiesKeys, null, 2)
        })
    } else {
        res.send({
            error: "You must be sign in to view the protected content on this page.",
        })
    }
}
