import BalanceSheetPendingStyled from './overrides/balanceSheetPendingStyle';
import {useTranslation} from 'next-i18next'
import React, {useRef, useState} from 'react';
import {Card, IconButton, Stack, Typography} from "@mui/material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

function MedicalImagingDialog({...props}) {
    const {data} = props;
    console.log(data)
    const [images] = useState<any>(data.state);
    const [files, setFiles] = useState<any>([]);
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const hiddenFileInput = useRef(null);

    const handleChange = (ev: any, uuid: string) => {
        const fileUploaded = ev.target.files[0];
        console.log(fileUploaded)
        files.push({
            [uuid]: fileUploaded
        })
        setFiles([...files])
        data.setState({files: [...files], uuid: data.state.uuid})

    };
    if (!ready) return <>loading translations...</>;
    return (
        <BalanceSheetPendingStyled>
            <Typography gutterBottom>{t('medical_imagery_list')}</Typography>
            {
                images['medical-imaging'].map((item: any, index: number) => (
                    <Card key={index} sx={{p: 1}}>
                        <Stack direction='row' alignItems="center" justifyContent='space-between'>
                            <Typography>{item['medical-imaging'].name}</Typography>

                            <>
                                <IconButton size="small" onClick={() => {
                                    if (hiddenFileInput.current) {
                                        (hiddenFileInput.current as HTMLElement).click()
                                    }
                                }}>
                                    <FileDownloadOutlinedIcon style={{color: '#a6abaf'}}/>
                                </IconButton>
                                <input
                                    type="file"
                                    ref={hiddenFileInput}
                                    onChange={(ev) => {
                                        handleChange(ev, item.uuid)
                                    }}
                                    style={{display: 'none'}}
                                />
                            </>


                            {/*<IconButton size="small">
                                <PhotoCameraBackOutlinedIcon style={{color:'#a6abaf'}} />
                            </IconButton>*/}
                        </Stack>
                    </Card>
                ))}
        </BalanceSheetPendingStyled>
    )
}

export default MedicalImagingDialog
