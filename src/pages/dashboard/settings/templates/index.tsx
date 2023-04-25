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
        url: `/api/medical-professional/${medical_professional?.uuid}/header/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    useEffect(()=>{
        if (httpDocumentHeader){
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
        router.push(`/dashboard/settings/templates/${id}`);
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
                        router.push(`/dashboard/settings/templates/new`);
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
                        <Box key={res.uuid} className={"container"}>
                            <div onMouseOver={()=>{handleMouseOver(res.uuid)}}
                                 onMouseOut={handleMouseOut}>
                                <PreviewA4  {...{eventHandler:null, data:res.header.data, values:res.header.header,state:null, loading}} />
                            </div>
                            {isHovering === res.uuid &&
                                <Button variant={"contained"} onMouseOver={()=>{handleMouseOver(res.uuid)}} className={"edit-btn"} onClick={()=>{edit(res.uuid)}}>Modifier</Button>}
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mt={2}>
                                <Typography className={"doc-title"}>{res.title}</Typography>
                                {res.isDefault && <div className={"heading"}>
                                    Par défault
                                </div>}
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
