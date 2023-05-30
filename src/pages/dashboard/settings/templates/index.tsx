import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {Box, Button, LinearProgress, Stack, Typography, useMediaQuery} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";
import TemplateStyled from "@features/pfTemplateDetail/components/overrides/templateStyled";
import {RootStyled} from "@features/toolbar";
import AddIcon from "@mui/icons-material/Add";
import {SubHeader} from "@features/subHeader";
import PreviewA4 from "@features/files/components/previewA4";
import {useSession} from "next-auth/react";
import {useRequest} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalProfessionalSuffix} from "@lib/hooks";

function TemplatesConfig() {
    const router = useRouter();
    const {data: session} = useSession();
    const isMobile = useMediaQuery("(max-width:669px)");
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "documents.config"});

    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState<DocTemplateModel[]>([]);
    const [isHovering, setIsHovering] = useState("");

    const {data: httpDocumentHeader} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/header/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const handleMouseOver = (id: string) => {
        setIsHovering(id);
    };

    const handleMouseOut = () => {
        setIsHovering("");
    };

    const edit = (id: string) => {
        router.push(`/dashboard/settings/templates/${id}`);
    }

    useEffect(() => {
        if (httpDocumentHeader) {
            const dcs = (httpDocumentHeader as HttpResponse).data;
            dcs.map((dc: DocTemplateModel) => {
                if (dc.file) {
                    dc.header.data.background.content = dc.file
                }
            });
            setDocs(dcs)
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [httpDocumentHeader])

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);


    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>

                <Button
                    type="submit"
                    variant="contained"
                    onClick={() => {
                        router.push(`/dashboard/settings/templates/new`);
                    }}
                    color="success">
                    {!isMobile ? t("add") : <AddIcon/>}
                </Button>
            </SubHeader>
            <LinearProgress
                sx={{visibility: loading ? "visible" : "hidden"}}
                color="warning"
            />

            <Box
                bgcolor={(theme) => theme.palette.background.default}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <TemplateStyled>
                    {docs.map(res => (
                        <Box key={res.uuid} className={"container"}>
                            <div onMouseOver={() => {
                                handleMouseOver(res.uuid)
                            }}
                                 onMouseOut={handleMouseOut}>
                                <PreviewA4  {...{
                                    eventHandler: null,
                                    data: res.header.data,
                                    values: res.header.header,
                                    state: null,
                                    loading
                                }} />
                            </div>
                            {isHovering === res.uuid &&
                                <Button variant={"contained"} onMouseOver={() => {
                                    handleMouseOver(res.uuid)
                                }} className={"edit-btn"} onClick={() => {
                                    edit(res.uuid)
                                }}>Modifier</Button>}
                            {!loading &&
                                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mt={1}>
                                    <Typography className={"doc-title"}>{res.title}</Typography>
                                    <div className={"heading"}>
                                        {res.header.data.size === 'portraitA4' ? 'A4' : 'A5'}
                                    </div>
                                </Stack>}
                        </Box>
                    ))}
                </TemplateStyled>
            </Box>

        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "patient",
            "settings",
        ])),
    },
});
export default TemplatesConfig;

TemplatesConfig.auth = true;

TemplatesConfig.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
