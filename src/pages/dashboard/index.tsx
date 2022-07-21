import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { CalendarToolbar } from "@features/toolbar";
import { DashLayout } from "@features/base";
import requestAxios from "@app/axios/config";
import { useSession } from "next-auth/react";
import { LoadingScreen } from "@features/loadingScreen";
import { AxiosRequestHeaders } from "axios";
import useRequest from "@app/axios/useRequest";
import { Session } from "next-auth";

const fetcher = (url: string, headers: AxiosRequestHeaders) => requestAxios({ url, method: "GET", headers }).then(res => res.data);

const API = "/api/private/user/fr";

function Dashborad() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    console.log(session);
    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }

    const { data, error } = useRequest({
        method: "GET",
        url: "/api/private/users/fr",
        headers
    });

    const loading = status === 'loading';
    if (loading) return (<LoadingScreen />);

    if (error) return <div>failed to load</div>
    if (!data) return <LoadingScreen />;

    const { data: user } = session as Session;

    return (
        <>
            <SubHeader>
                <CalendarToolbar date={date} />
            </SubHeader>
            <Box className="container">
                <Typography variant="subtitle1">Hello from {router.pathname.slice(1)}</Typography>
                {session && <Typography>URL: {(user as UserDataResponse)?.general_information.firstName}</Typography>}
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'agenda']))
        }
    }
}

// Export the `session` prop to use sessions with Server Side Rendering

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const request = context.req as any;
//     const jwt = await getToken({
//         req: request
//     });
//
//     const headers = {
//         Authorization: `Bearer ${jwt?.accessToken}`,
//         'Content-Type': 'application/json',
//     }
//
//     return {
//         props: {
//             fallback: {
//                 [API]: await fetcher(API, headers)
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
