import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {useRouter} from "next/router";
import {Box, Typography} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {CalendarToolbar} from "@features/calendarToolbar";
import {DashLayout} from "@features/base";
import requestAxios from "@app/axios/config";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {LoadingScreen} from "@features/loadingScreen";
import {useDispatch} from "react-redux";
import {setAccessToken, setUserData} from "@features/user";


const fetcher = (url: string) => requestAxios({url, method: "GET"}).then(res => res.data);

const API = "/api/private/user/fr";

function Dashborad({...props}: any) {
    console.log("Dashborad", props);
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    // const {data, error} = useSWR(API);

    const loading = status === 'loading'
    if (loading) return (<LoadingScreen />);
    const { data: user, accessToken } = session as Session;

    console.log(session);

    // if (error) return <div>failed to load</div>
    // if (!data) return <div>loading...</div>

    return (
        <>
            <SubHeader>
                <CalendarToolbar date={date}/>
            </SubHeader>
            <Box bgcolor="#F0FAFF"
                 sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <Typography variant="subtitle1">Hello from {router.pathname.slice(1)}</Typography>
                {session && <Typography>URL: {(user as any)?.data.general_information.first_name}</Typography>}
            </Box>
        </>
    )
}

// export const getStaticProps: GetStaticProps = async ({locale}) => {
//     // const repoInfo = await fetcher(API);
//     return {
//         props: {
//             // fallback: {
//             //     [API]: repoInfo
//             // },
//             ...(await serverSideTranslations(locale as string, ['common', 'menu', 'agenda']))
//         }
//     }
// }

// Export the `session` prop to use sessions with Server Side Rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
    // const repoInfo = await fetcher(API)
    // const request = context.req as any;
    // const token = await getToken({
    //     req: request
    // });
    const cookie = context.req.headers.cookie;
    return {
        props: {
            cookies: cookie,
            ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'agenda']))
        }
    }
}

Dashborad.auth = true

Dashborad.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

export default Dashborad
