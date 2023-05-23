import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";

export default async function server_env(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    const {key} = req.body;
    if (session) {
        res.send(JSON.stringify(process.env[key], null, 2))
    } else {
        res.send({
            error: "You must be sign in to view the protected content on this page.",
        })
    }
}
