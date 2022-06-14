import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {useRouter} from "next/router";
import {Box} from "@mui/material";
import SubHeader from "@features/subHeader/components/subHeader";
import CalendarToolbar from "@features/calendarToolbar/components/calendarToolbar";
import DashLayout from "@features/base/dashLayout";
import {UseRequest} from "@app/axios";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const API = "https://api.github.com/repos/vercel/swr";

function Dashborad(){
    const router = useRouter();
    const [date, setDate] = useState(new Date());

    // const { data, error }: any = UseRequest<string[]>({
    //     url: API
    // })
    const { data, error } = useSWR(API);

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    console.log(data);
    return(
        <>
            <SubHeader>
                <CalendarToolbar date={date} />
            </SubHeader>
            <Box bgcolor="#F0FAFF"
                 sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>

                <div>Hello from {router.pathname.slice(1)}</div>
                <p>URL: {data.url}</p>
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

export default Dashborad

Dashborad.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
