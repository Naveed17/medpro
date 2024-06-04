import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "./[...nextauth]";

const NEXTAUTH_LOGOUT_URL = process.env.NEXTAUTH_LOGOUT_URL

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    //const path = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=${NEXTAUTH_LOGOUT_URL}`;

    let path = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?post_logout_redirect_uri=${NEXTAUTH_LOGOUT_URL}`;

    if (session?.idToken) {
        path = path + `&id_token_hint=${session.idToken}`
    } else {
        path = path + `&client_id=${process.env.NEXTAUTH_CLIENT_ID}`
    }
    res.status(200).json({path});
};
