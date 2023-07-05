import {useTranslation} from 'next-i18next'
import React from 'react';
import {TextField, Typography} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";

function ModelDialog({...props}) {
    const {data} = props;
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);
    return (
        <>
            <Typography>{t('namedModel')}</Typography>
            <TextField
                fullWidth
                id={"model-name"}
                size="small"
                onChange={(ev) => {
                    data.setModel(ev.target.value);
                }}
                value={data.model}
                sx={{marginTop: 2, marginBottom: 5}}/>
        </>
    )
}

export default ModelDialog
