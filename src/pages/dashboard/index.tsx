import {GetServerSideProps, GetStaticProps} from "next";
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
import {AxiosRequestHeaders} from "axios";
import {getToken} from "next-auth/jwt";
import useSWR, {useSWRConfig} from "swr";
import useRequest from "@app/axios/axiosServiceApi";

const fetcher = (url: string, headers: AxiosRequestHeaders) => requestAxios({url, method: "GET", headers}).then(res => res.data);

const API = "https://pokeapi.co/api/v2/pokemon/bulbasaur";

function Dashborad({...props}) {
    const { cache } = useSWRConfig();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }

    const { data, error, response, mutate, isValidating} = useRequest({
        method: "GET",
        url: "https://pokeapi.co/api/v2/pokemon/bulbasaur",
        headers
    });
    // const { data, error } = useSWR(API);

    const loading = status === 'loading';
    if (loading) return (<LoadingScreen />);

    const { data: user, accessToken } = session as Session;

    if (error) return <div>failed to load</div>
    if (!data) return <LoadingScreen />;

    console.log(user);

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
