import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {Box, Button, LinearProgress, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
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
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "documents.config"});

    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState<DocTemplateModel[]>([]);
    const [isdefault, setIsDefault] = useState<DocTemplateModel | null>(null);
    const [isHovering, setIsHovering] = useState("");
    const theme = useTheme();

    const {data: httpDocumentHeader} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/header/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {data: httpModelResponse} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {data: httpPrescriptionResponse} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);


    const models = (httpModelResponse as HttpResponse)?.data as CertifModel[];

    const modelPrescrition = (httpPrescriptionResponse as HttpResponse)?.data as ModalModel[];

    console.log(models)

    const handleMouseOver = (id: string | undefined) => {
        setIsHovering(id ? id : "");
    };
    const handleMouseOut = () => {
        setIsHovering("");
    };
    const edit = (id: string | undefined) => {
        router.push(`/dashboard/settings/templates/${id}`);
    }

    useEffect(() => {
        if (httpDocumentHeader) {
            const dcs = (httpDocumentHeader as HttpResponse).data;
            dcs.map((dc: DocTemplateModel) => {
                if (dc.isDefault) setIsDefault(dc);
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

    useEffect(() => {
        console.log(models)
    }, [models])

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);


    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>
            </SubHeader>
            <LinearProgress
                sx={{visibility: loading ? "visible" : "hidden"}}
                color="warning"
            />

            <Typography
                textTransform="uppercase"
                marginTop={2}
                marginLeft={2}
                fontWeight={600}>
                {t("layout")}
            </Typography>
            <Box
                bgcolor={(theme) => theme.palette.background.default}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <TemplateStyled>
                    <div className={"portraitA4"} onClick={() => {
                        router.push(`/dashboard/settings/templates/new`);
                    }} style={{
                        marginTop: 25,
                        marginRight: 30,
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <AddIcon style={{fontSize: 450, color: theme.palette.primary.main}}/>
                    </div>
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
                                }}>{t("modifier")}</Button>}
                            {/* {!loading &&
                                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mt={1}>
                                            <Typography className={"doc-title"}>{res.title}</Typography>
                                            <div className={"heading"}>
                                                {res.header.data.size === 'portraitA4' ? 'A4' : 'A5'}
                                            </div>
                                        </Stack>}*/}
                        </Box>
                    ))}
                </TemplateStyled>
            </Box>

            <Typography
                textTransform="uppercase"
                marginLeft={2}
                fontWeight={600}>
                {t("prescription")}
            </Typography>

            <TemplateStyled>
                <Box
                    bgcolor={(theme) => theme.palette.background.default}
                    sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                    <div className={"portraitA4"} onClick={() => {
                        router.push(`/dashboard/settings/templates/new`);
                    }} style={{
                        marginTop: 25,
                        marginRight: 30,
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <AddIcon style={{fontSize: 450, color: theme.palette.primary.main}}/>
                    </div>
                </Box></TemplateStyled>

            <Typography
                textTransform="uppercase"
                marginLeft={2}
                fontWeight={600}>
                {t("document")}
            </Typography>

            <Box
                bgcolor={(theme) => theme.palette.background.default}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <TemplateStyled>
                    <div className={"portraitA4"} onClick={() => {
                        router.push(`/dashboard/settings/templates/new`);
                    }} style={{
                        marginTop: 25,
                        marginRight: 30,
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <AddIcon style={{fontSize: 450, color: theme.palette.primary.main}}/>
                    </div>

                    {models && isdefault && models.map(res => (
                        <Box key={res.uuid} className={"container"}>
                            <div onMouseOver={() => {
                                handleMouseOver(res.uuid)
                            }}
                                 onMouseOut={handleMouseOut}>
                                <PreviewA4  {...{
                                    eventHandler: null,
                                    data: isdefault?.header.data,
                                    values: isdefault?.header.header,
                                    state: {
                                        content: res.content,
                                        description:"",
                                        doctor:"",
                                        name:"certif",
                                        patient:"Patient",
                                        title:res.title,
                                        type:"write_certif"
                                    },
                                    loading
                                }} />
                            </div>
                            {isHovering === res.uuid &&
                                <Button variant={"contained"} onMouseOver={() => {
                                    handleMouseOver(res.uuid)
                                }} className={"edit-btn"} onClick={() => {
                                    edit(res.uuid)
                                }}>{t("modifier")}</Button>}

                            {isHovering === res.uuid &&<Stack direction={"row"} className={"title-content"}>
                                <Typography className={"title"}>{res.title}</Typography>
                                <div className={"color-content"} style={{background:res.color}}></div>
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
