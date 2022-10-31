import {NextApiRequest, NextApiResponse} from "next";

const NEXTAUTH_LOGOUT_URL = process.env.NEXTAUTH_LOGOUT_URL

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    const path = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=${NEXTAUTH_LOGOUT_URL}`;

    res.status(200).json({ path });
};
