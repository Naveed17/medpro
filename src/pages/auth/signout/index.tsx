import React, {useEffect, useState} from "react";
import {Redirect} from "@features/redirect";
import axios from "axios";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function SignOut() {
    const [loading, setLoading] = useState<boolean>(true);
    const [logoutPath, setLogoutPath] = useState("");

    useEffect(() => {
        getLogoutPath().then(path => {
            setLogoutPath(path);
            setLoading(false);
        })
    })

    const getLogoutPath = async () => {
        const {
            data: {path}
        } = await axios({
            url: "/api/auth/logout",
            method: "GET"
        });

        return path;
    }

    return (loading ? <LoadingScreen/> : <Redirect to={logoutPath}/>)
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common']))
    }
})
export default SignOut;
