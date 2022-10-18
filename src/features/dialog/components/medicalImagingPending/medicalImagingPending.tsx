import BalanceSheetPendingStyled from './overrides/balanceSheetPendingStyle';
import {useTranslation} from 'next-i18next'
import React, {useState} from 'react';
import {Card, CircularProgress, IconButton, Stack, Typography} from "@mui/material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import CheckIcon from '@mui/icons-material/Check';

function MedicalImagingDialog({...props}) {
    const {data} = props;

    const [images] = useState<any>(data.state);
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState('');


    console.log(files.find(file => file.uuid === 'item.uuid'))

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const {trigger} = useRequestMutation(null, "/medicalImaging");
    const {data: session} = useSession();
    const router = useRouter();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const handleChange = (ev: any, uuid: string) => {
        const fileUploaded = ev.target.files[0];
        const form = new FormData();
        form.append("files", fileUploaded, fileUploaded.name);
        trigger(
            {
                method: "PUT",
                url: `/api/medical-entity/${medical_entity.uuid}/appointment/${router.query["uuid-consultation"]}/medical-imaging/${images.uuid}/medical-imaging-request/${uuid}/${router.locale}`,
                data: form,
                headers: {
                    ContentType: "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            },
            {revalidate: true, populateCache: true}
        ).then((r: any) => {
            files.push({uuid: uuid, file: r.data.data[0]})
            setFiles([...files])
            console.log(files)
            setLoading('')
        });

    };
    if (!ready) return <>loading translations...</>;
    return (
        <BalanceSheetPendingStyled>
            <Typography gutterBottom>{t('medical_imagery_list')}</Typography>
            {
                images['medical-imaging'].map((item: any, index: number) => (
                    <Card key={index} sx={{p: 1}}>
                        <Stack direction='row'
                               alignItems="center"
                               style={{
                                   opacity: item.uri !== '' || files.find(file => file.uuid === item.uuid) ? 0.5 : 1
                               }}
                               justifyContent='space-between'>
                            <Typography>{item['medical-imaging'].name}</Typography>
                            {
                                loading !== item.uuid && item.uri === '' && files.find(file => file.uuid === item.uuid) === undefined && <>
                                    <IconButton size="small" onClick={() => {
                                        (document.getElementById(item.uuid + 'file') as HTMLElement).click()
                                    }}>
                                        <FileDownloadOutlinedIcon style={{color: '#a6abaf'}}/>
                                    </IconButton>
                                    <input
                                        type="file"
                                        id={item.uuid + 'file'}
                                        onChange={(ev) => {
                                            setLoading(item.uuid)
                                            handleChange(ev, item.uuid)
                                        }}
                                        style={{display: 'none'}}
                                    />
                                </>
                            }

                            {
                                (item.uri !== '' || files.find(file => file.uuid === item.uuid)) &&
                                <IconButton size="small">
                                    <CheckIcon color={"success"}/>
                                </IconButton>
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
