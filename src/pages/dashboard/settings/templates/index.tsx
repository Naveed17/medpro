import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {Box, Button, Stack, Typography, useMediaQuery} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";
import TemplateStyled from "@features/pfTemplateDetail/components/overrides/templateStyled";
import {RootStyled} from "@features/toolbar";
import AddIcon from "@mui/icons-material/Add";
import {SubHeader} from "@features/subHeader";
import PreviewA4 from "@features/files/components/previewA4";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useRouter} from "next/router";

function TemplatesConfig() {

    const isMobile = useMediaQuery("(max-width:669px)");

    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState<DocTemplateModel[]>([]);

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "documents.config"});

    const [isHovering, setIsHovering] = useState("");

    const {data: session} = useSession();
    const router = useRouter();

    const {data: user} = session as Session;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {data: httpDocumentHeader} = useRequest({
        method: "GET",
        url: "/api/medical-professional/" + medical_professional?.uuid + "/header/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    useEffect(()=>{
        if (httpDocumentHeader){
            console.log(httpDocumentHeader)
            setDocs((httpDocumentHeader as HttpResponse).data)
            setTimeout(()=>{
                setLoading(false)
            },500)
        }
    },[httpDocumentHeader])
    const handleMouseOver = (id:string) => {
        setIsHovering(id);
    };

    const handleMouseOut = () => {
        setIsHovering("");
    };

    const edit = (id:string) =>{
        console.log(id);
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);


    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{ margin: 0 }}>{t("path")}</p>
                </RootStyled>

                <Button
                    type="submit"
                    variant="contained"
                    onClick={() => {
                    }}
                    color="success">
                    {!isMobile ? t("add") : <AddIcon />}
                </Button>
            </SubHeader>

            <Box
                bgcolor={(theme) => theme.palette.background.default}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <TemplateStyled>
                    {docs.map(res => (
                        <Box key={res} className={"container"}>
                            <div onMouseOver={()=>{handleMouseOver(res)}}
                                 onMouseOut={handleMouseOut}>
                                <PreviewA4  {...{eventHandler:null, data:res.data, values:res.header,state:null, loading}} />
                            </div>
                            {isHovering === res &&
                                <Button variant={"contained"} onMouseOver={()=>{handleMouseOver(res)}} className={"edit-btn"} onClick={()=>{edit(res)}}>Modifier</Button>}
                            <Stack direction={"row"} justifyContent={"space-between"} mt={2}>
                                <Typography className={"doc-title"}>Mono ex</Typography>
                                <div className={"heading"}>
                                    A5
                                </div>
                            </Stack>
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
