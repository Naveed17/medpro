import {NextResponse} from 'next/server'
import * as Ably from "ably/promises";
import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.ABLY_API_KEY) {
        return NextResponse.json({
            errorMessage: `Missing ABLY_API_KEY environment variable.
        If you're running locally, please ensure you have a ./.env file with a value for ABLY_API_KEY=your-key.
        If you're running in Netlify, make sure you've configured env variable ABLY_API_KEY. 
        Please see README.md for more details on configuring your Ably API Key.`,
        }, {
            status: 500,
            headers: new Headers({
                "content-type": "application/json"
            })
        });
    }

    const session = await getServerSession(req, res, authOptions);
    const {data: user} = session as Session;
    const general_information = (user as UserDataResponse).general_information;

    const client = new Ably.Rest(process.env.ABLY_API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({clientId: general_information.uuid});
    return res.send(tokenRequestData)
}
