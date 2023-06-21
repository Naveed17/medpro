import React, {useEffect, useState} from "react";
import {CircularProgress, Grid, Stack, Theme, Typography, useTheme} from "@mui/material";
import AddDocumentDialogStyled from "./overrides/addDocumentDialogStyle";
import {DocumentButton} from "@features/buttons";
import {useTranslation} from "next-i18next";
import {FileuploadProgress} from "@features/progressUI";
import {useRequest} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";
import IconUrl from "@themes/urlIcon";
import Resizer from "react-image-file-resizer";

function AddDocumentDialog({...props}) {
    const [files, setFiles] = useState<any[]>([]);
    const [type, setType] = useState("");
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(false);
    const {data} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const theme = useTheme() as Theme;
    const [progress, setProgress] = useState(0);

    const {data: httpTypeResponse} = useRequest({
        method: "GET",
        url: `/api/private/document/types/${router.locale}`,
        headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

    useEffect(() => {
        if (httpTypeResponse) {
            setTypes((httpTypeResponse as HttpResponse).data);
            setLoading(false);
        }
    }, [httpTypeResponse]);

    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file.file !== file));
    };

    useEffect(() => {
        data.state.files = files;
        data.setState(data.state);
        data.handleUpdateFiles && data.handleUpdateFiles(files);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    const handleChange = (e: { target: { files: any[]; }; }) => {
        setLoad(true);
        const filesAccepted = e.target.files;
        let docs: any = [];
        Array.from(filesAccepted).forEach((file) => {
            if (file.type.includes('image')) {
                Resizer.imageFileResizer(file,
                    850,
                    850,
                    file.type.split('/')[1],
                    80,
                    0,
                    (uri) => {
                        docs.push({type: type, file: uri, progress: 100})
                        setFiles([...files, ...docs]);
                        setLoad(false);
                    },
                    "file")
            } else {
                docs.push({type: type, file, progress: 100})
                setTimeout(() => {
                    setFiles([...files, ...docs]);
                    setLoad(false);
                }, 1000);
            }

        })


        setTimeout(() => {
            const el = document.getElementById("label")
            if (el)
                el.scrollIntoView(true);
        }, 1500);

    }
    const {t, ready} = useTranslation("common");

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <AddDocumentDialogStyled>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Typography fontWeight={600} mb={2} variant="subtitle2">
                        {t("type_of_document")}
                    </Typography>
                    <Grid container spacing={1} mt={6} margin={"auto"}>
                        {loading
                            ? Array.from(new Array(6)).map((val, idx) => (
                                <Grid key={"loading-card-" + idx} item xs={6} md={6}>
                                    <DocumentButton
                                        selected={""}
                                        height={100}
                                        paddingTop={20}
                                        loading={true}
                                        active={data.state.type}
                                    />
                                </Grid>
                            ))
                            : types.map(
                                (item: any, index) => (
                                    <Grid key={index} item xs={6} md={6}>
                                        <DocumentButton
                                            icon={item.logo.url}
                                            active={data.state.type}
                                            t={t}
                                            lable={item.name}
                                            acceptedFormat={item.acceptedFormat}
                                            uuid={item.uuid}
                                            selected={type}
                                            handleChange={handleChange}
                                            height={100}
                                            handleOnClick={(v: string) => {
                                                setType(v);
                                                data.state.type = v;
                                                data.setState(data.state);
                                            }}
                                        />

                                    </Grid>
                                )
                            )}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={9}>
                    {files.length === 0 && <Stack width={"80%"}
                                                  margin={"auto"}
                                                  mt={6}
                                                  spacing={2}
                                                  padding={2}
                                                  border={`1px dashed ${theme.palette.primary.main}`}
                                                  borderRadius={2}>
                        <div style={{width: "fit-content", margin: "auto"}}>
                            <IconUrl path={"ic-upload"} width={"100"} height={"100"}/>
                        </div>
                        {load && <div style={{width: "fit-content", margin: "auto"}}>
                            <CircularProgress style={{margin: "auto"}}/>
                        </div>}
                        <Typography color={"gray"} textAlign={"center"}>{t("type_of_document")}</Typography>
                        <Typography color={"gray"} textAlign={"center"}
                                    style={{opacity: 0.5}}>{t("to_upload")}</Typography>

                    </Stack>}
                    <Stack spacing={2} maxWidth="90%" width={1} mx="auto" mt={3}>
                        <Grid container spacing={{lg: 2, xs: 1}} alignItems="flex-start">
                            <Grid item xs={12} lg={12}>
                                {files.length > 0 && <Typography
                                    mt={1}
                                    mb={1}
                                    id={"label"}
                                    color="text.secondary"
                                    variant="body2"
                                    fontWeight={400}>
                                    {t("name_of_the_document")}
                                </Typography>}

                                <Stack spacing={2} maxWidth={{xs: "100%", md: "100%"}}>
                                    {files?.map((file: any, index: number) => (
                                        <FileuploadProgress
                                            key={index}
                                            file={file.file}
                                            progress={file.progress}
                                            handleRemove={handleRemove}
                                        />
                                    ))}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>
        </AddDocumentDialogStyled>
    );
}

export default AddDocumentDialog;
