import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";

export default async function server_env(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req})
    const {key} = req.body;
    if (session) {
        res.send(JSON.stringify(process.env[key], null, 2))
    } else {
        res.send({
            error: "You must be sign in to view the protected content on this page.",
        })
    }
}
