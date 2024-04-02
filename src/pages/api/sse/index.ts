// pages/api/sse
import {NextApiRequest, NextApiResponse} from "next";
import EventSource from "eventsource";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Encoding': 'none',
        'Cache-Control': 'no-cache, no-transform',
        'Content-Type': 'text/event-stream; charset=utf-8',
    });

    const session = await getServerSession(req, res, authOptions);

    const {data: user} = session as Session;
    const roles = (user as UserDataResponse)?.general_information.roles;
    const general_information = (user as UserDataResponse).general_information;

    const url = new URL(`${process.env.MERCURE_API_URL}.well-known/mercure`);
    url.searchParams.append('topic', `${process.env.MERCURE_API_URL}${roles[0]}-${general_information.uuid}`);

    const evtSource = new EventSource(url.toString(), {
        headers: {
            'Authorization': `Bearer ${process.env.MERCURE_JWT_TOKEN}`
        }
    })

    evtSource.onopen = () => {
        res.write(`event: message\nopenConnection: true\n\n`)
    };

    evtSource.onmessage = (e: MessageEvent<any>) => {
        res.write(`event: message\ndata: ${e.data}\n\n`)
    }

    evtSource.onerror = (e: Event) => {
        evtSource.close()
        res.write(`event: error\ndata: ${JSON.stringify(e)}\n\n`)
    }

    req.socket.on("close", () => {
        evtSource.close()
        res.end()
    })

}
