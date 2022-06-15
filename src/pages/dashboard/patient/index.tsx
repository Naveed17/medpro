import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {useRouter} from "next/router";
import {Box} from "@mui/material";
import DashLayout from "@features/base/dashLayout";
import {useAppSelector} from "@app/redux/hooks";
import {userSelector} from "@features/user";
import requestAxios from "@app/axios/config";
import useSWR from "swr";

const fetcher = (url: string) => requestAxios({url, method: "GET"}).then(res => res.data);

const API = "/api/private/user/fr";

function Patient(){
    const {data: user, accessToken} = useAppSelector(userSelector);
    console.log("Patient", user);
    const router = useRouter();
    const {data, error} = useSWR(API);
    const [date, setDate] = useState(new Date());
    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    console.log("useSWR", data);

    return(
        <>
            <Box bgcolor="#F0FAFF"
                 sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>

                <div>Hello from {router.pathname.slice(1)}</div>
            </Box>
        </>
        )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const repoInfo = await fetcher(API);
    return {
        props: {
            fallback: {
                [API]: repoInfo
            },
            ...(await serverSideTranslations(locale as string, ['common', 'menu', 'agenda']))
        }
    }
}

export default Patient

Patient.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
