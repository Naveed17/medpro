import {useTranslation} from "next-i18next";
import React from "react";
import {LoadingScreen} from "@features/loadingScreen";
import {TextField, Typography} from "@mui/material";

function CreateCashboxDialog({...props}) {
    const {data} = props;

    const {t, ready} = useTranslation('payment', {keyPrefix: 'filter'});
    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <Typography>{t('namedModel')}</Typography>
            <TextField
                fullWidth
                id={"model-name"}
                size="small"
                onChange={(ev) => {
                    data.setCashName(ev.target.value);
                }}
                value={data.cashName}
                sx={{marginTop: 2, marginBottom: 5}}/>
        </>
    )
}

export default CreateCashboxDialog
