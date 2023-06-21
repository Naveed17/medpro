import BalanceSheetPendingStyled from './overrides/balanceSheetPendingStyle';
import {useTranslation} from 'next-i18next'
import React, {useEffect, useState} from 'react';
import {Badge, Card, CircularProgress, Stack, Typography} from "@mui/material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";
import {useMedicalEntitySuffix} from "@lib/hooks";

function MedicalImagingDialog({...props}) {
    const {data} = props;
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const [images] = useState<any>(data.state);
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState('');

    useEffect(() => {
        const file: React.SetStateAction<any[]> = [];
        images['medical-imaging'].map((img: { uuid: any; uri: string | any[]; }) => {
            file.push({uuid: img.uuid, nb: img.uri.length})
        })
        setFiles(file)
    }, [images])

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const {trigger} = useRequestMutation(null, "/medicalImaging");
    const {data: session} = useSession();
    const router = useRouter();
    const handleChange = (ev: any, uuid: string) => {
        const filesUploaded = ev.target.files;

        Object.keys(filesUploaded).forEach(fu => {
            const form = new FormData();
            form.append("files", filesUploaded[fu], filesUploaded[fu].name);
            trigger(
                {
                    method: "PUT",
                    url: `${urlMedicalEntitySuffix}/appointment/${router.query["uuid-consultation"]}/medical-imaging/${images.uuid}/medical-imaging-request/${uuid}/${router.locale}`,
                    data: form,
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                },
                {revalidate: true, populateCache: true}
            ).then(() => {
                let selectedFile = files.findIndex(f => f.uuid === uuid)
                files[selectedFile].nb += 1
                setFiles([...files])
                setLoading('')
            });
        })
    };
    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <BalanceSheetPendingStyled>
            <Typography gutterBottom>{t('medical_imagery_list')}</Typography>
            {
                images['medical-imaging'].map((item: any, index: number) => (
                    <Card key={index} sx={{p: 1}}>
                        <Stack direction='row'
                               alignItems="center"
                               justifyContent='space-between'>
                            <Typography>{item['medical-imaging'].name}</Typography>
                            {
                                loading !== item.uuid && <>
                                    <Badge badgeContent={files?.find(f => f.uuid === item.uuid)?.nb} color="primary"
                                           style={{marginRight: 10, marginTop: 10}}
                                           onClick={() => {
                                               (document.getElementById(item.uuid + 'file') as HTMLElement).click()
                                           }}>
                                        <FileDownloadOutlinedIcon style={{color: '#a6abaf'}}/>
                                    </Badge>
                                    <input
                                        type="file"
                                        id={item.uuid + 'file'}
                                        multiple={true}
                                        accept="image/png, image/jpeg,image/jpg, .pdf"
                                        onChange={(ev) => {
                                            setLoading(item.uuid)
                                            handleChange(ev, item.uuid)
                                        }}
                                        style={{display: 'none'}}
                                    />
                                </>
                            }

                            {loading === item.uuid &&
                                <CircularProgress style={{width: 20, height: 20, marginRight: 10}}/>}

                        </Stack>
                    </Card>
                ))}
        </BalanceSheetPendingStyled>
    )
}

export default MedicalImagingDialog
