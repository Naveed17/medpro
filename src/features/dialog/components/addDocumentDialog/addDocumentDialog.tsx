import React, {useEffect, useState} from "react";
import {Grid, Stack, Typography} from "@mui/material";
import AddDocumentDialogStyled from "./overrides/addDocumentDialogStyle";
import {DocumentButton} from "@features/buttons";
import {UploadFile} from "@features/uploadFile";
import {useTranslation} from "next-i18next";
import {FileuploadProgress} from "@features/fileUploadProgress";
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";

function AddDocumentDialog({...props}) {
    const [files, setFiles] = useState<any[]>([]);
    const [type, setType] = useState("");
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const {data} = props;
    const router = useRouter();
    const {data: session} = useSession();

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

    const handleDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            setFiles([...files, ...acceptedFiles]);
        },
        [files]
    );
    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file !== file));
    };

    useEffect(() => {
        data.state.files = files;
        data.setState(data.state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);
    const {t, ready} = useTranslation("common");

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <AddDocumentDialogStyled>
            <Typography fontWeight={600} variant="subtitle2">
                {t("type_of_document")}
            </Typography>
            <Stack maxWidth="90%" m="auto" width="100%">
                <Grid container spacing={2} mt={2} margin={"auto"}>
                    {loading
                        ? Array.from(new Array(6)).map((val, idx) => (
                            <Grid key={"loading-card-" + idx} item xs={6} md={2}>
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
                            (item: { logo: string; name: string; uuid: string }, index) => (
                                <Grid key={index} item xs={6} md={2}>
                                    <DocumentButton
                                        icon={item.logo}
                                        active={data.state.type}
                                        t={t}
                                        lable={item.name}
                                        uuid={item.uuid}
                                        selected={type}
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
            </Stack>
            <Stack spacing={2} maxWidth="90%" width={1} mx="auto" mt={3}>
                <Grid container spacing={{lg: 2, xs: 1}} alignItems="flex-start">
                    {/*<Grid item xs={12} lg={3}>
                        <Typography
                            textAlign={{lg: "right", xs: "left"}}
                            color="text.secondary"
                            variant="body2"
                            fontWeight={400}>
                            {t("name_of_the_document")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <TextField
                            variant="outlined"
                            value={name}
                            onChange={(ev) => {
                                setName(ev.target.value);
                                data.state.name = ev.target.value;
                                data.setState(data.state);
                            }}
                            placeholder={t("type_the_name_of_the_document")}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Typography
                            textAlign={{lg: "right", xs: "left"}}
                            color="text.secondary"
                            variant="body2"
                            fontWeight={400}>
                            {t("description")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <TextField
                            variant="outlined"
                            placeholder={t("type_a_description")}
                            value={description}
                            onChange={(ev) => {
                                setDescription(ev.target.value);
                                data.state.description = ev.target.value;
                            }}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Typography
                            textAlign={{lg: "right", xs: "left"}}
                            color="text.secondary"
                            variant="body2"
                            fontWeight={400}>
                            {t("import_document")}
                        </Typography>
                    </Grid>*/}
                    <Grid item xs={12} lg={12}>
                        <UploadFile
                            files={files}
                            accept={{
                                'image/jpeg': ['.pdf', '.png', '.jpeg', '.jpg', '.wav', '.mp4']
                            }}
                            onDrop={handleDrop}
                            singleFile={false}
                        />

                        {files.length > 0 && <Typography
                            mt={5}
                            mb={1}
                            color="text.secondary"
                            variant="body2"
                            fontWeight={400}>
                            {t("name_of_the_document")}
                        </Typography>}

                        <Stack spacing={2} maxWidth={{xs: "100%", md: "100%"}}>
                            {files?.map((file: any, index: number) => (
                                <FileuploadProgress
                                    key={index}
                                    file={file}
                                    progress={100}
                                    handleRemove={handleRemove}
                                />
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </AddDocumentDialogStyled>
    );
}

export default AddDocumentDialog;
