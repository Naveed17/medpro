import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {useRouter} from "next/router";
import {Box} from "@mui/material";
import {useSession} from "next-auth/react";


function EditProfile(){
    const { data: session, status } = useSession();
    const router = useRouter();

    const [date, setDate] = useState(new Date());
    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

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
    return {
        props: {
            ...(await serverSideTranslations(locale as string, ['common', 'menu', 'agenda']))
        }
    }
}

export default EditProfile;

EditProfile.auth = true;

EditProfile.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            {page}
        </>
    )
}
