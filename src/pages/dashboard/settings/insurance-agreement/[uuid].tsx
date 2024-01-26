import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useEffect, useState, } from "react";
import { SubHeader } from "@features/subHeader";
import { useTranslation } from "next-i18next";
import {
    Box, useMediaQuery, useTheme

} from "@mui/material";
import { RootStyled } from "@features/toolbar";
import { useRouter } from "next/router";
import { DashLayout, dashLayoutSelector } from "@features/base";
import { LoadingScreen } from "@features/loadingScreen";
import { useRequestQuery } from "@lib/axios";
import { useAppSelector } from "@lib/redux/hooks";
import { useMedicalEntitySuffix, useMedicalProfessionalSuffix } from "@lib/hooks";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";


function Actes() {
    const router = useRouter();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const { medical_professional } = useMedicalProfessionalSuffix();
    const { t, ready } = useTranslation("settings");
    const { uuid } = router.query;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [mainActes, setMainActes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { data: httpProfessionalsActs, mutate: mutateActs, error } = useRequestQuery(medical_professional ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(medical_professional && { variables: { query: !isMobile ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true` : "?sort=true" } })
    });
    useEffect(() => {
        setLoading(true);
        if (httpProfessionalsActs !== undefined) {
            if (isMobile) {
                const response = (httpProfessionalsActs as HttpResponse).data;
                setMainActes(response as ActModel[]);
                setLoading(false);
            } else {
                const response = (httpProfessionalsActs as HttpResponse)?.data?.list ?? [];
                setMainActes(response as ActModel[]);
                setLoading(false);
            }
        }
    }, [httpProfessionalsActs]); // eslint-disable-line react-hooks/exhaustive-deps
    if (!ready || error) {
        return <LoadingScreen
            button
            {...(error ? {
                OnClick: () => router.push('/dashboard/settings/users'),
                text: 'loading-error-404-reset'
            } : {})}
        />;
    }
    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{ margin: 0 }}>{t("users.path_update")}</p>
                </RootStyled>
            </SubHeader>

            <Box className="container">
            </Box>
        </>
    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export const getStaticProps: GetStaticProps = async ({ locale }) => {

    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "common",
                "menu",
                "patient",
                "settings",
            ])),
        },
    }
};

export default Actes;

Actes.auth = true;

Actes.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
