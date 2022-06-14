import {GetServerSideProps, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Box, Typography} from "@mui/material";
import SubHeader from "@features/subHeader/components/subHeader";
import CalendarToolbar from "@features/calendarToolbar/components/calendarToolbar";
import DashLayout from "@features/base/dashLayout";
import useSWR from "swr";
import requestAxios from "@app/axios/config";
import {getCsrfToken, getSession, useSession} from "next-auth/react";
import {Session} from "next-auth";
import {LoadingScreen} from "@features/loadingScreen";
import {getToken} from "next-auth/jwt";

const fetcher = (url: string) => requestAxios({url, method: "GET"}).then(res => res.data);

const API = "/api/private/user/fr";

function Dashborad() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    // const {data, error} = useSWR(API);

    const loading = status === 'loading'
    if (loading) return (<LoadingScreen />);

    console.log("Dashborad", session);
    const { data: user } = session as Session;


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
                {session && <Typography>URL: {(user as any)?.data.medical_professional.public_name}</Typography>}
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    // const repoInfo = await fetcher(API);
    return {
        props: {
            // fallback: {
            //     [API]: repoInfo
            // },
            ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'agenda']))
        }
    }
}

// Export the `session` prop to use sessions with Server Side Rendering
// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const repoInfo = await fetcher(API);
//     return {
//         props: {
//             session: await getSession(context),
//             fallback: {
//                 [API]: repoInfo
//             },
//             ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'agenda']))
//         }
//     }
// }


Dashborad.auth = true

Dashborad.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

export default Dashborad
