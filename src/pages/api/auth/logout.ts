import {NextApiRequest, NextApiResponse} from "next";

const NEXTAUTH_URL = process.env.NEXTAUTH_URL

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    const path = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(<string>NEXTAUTH_URL)}`;

    res.status(200).json({ path });
};
