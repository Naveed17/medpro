
import {useFormik} from "formik";
import {useTranslation} from 'next-i18next'
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import {TextField, Typography} from "@mui/material";

function ModelDialog({...props}) {
    const {data} = props;
    console.log(data)
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const router = useRouter();
    const {data: session} = useSession();

    if (!ready) return <>loading translations...</>;
    return (
        <>
            <Typography>{t('namedModel')}</Typography>
            <TextField
                fullWidth
                id={"model-name"}
                size="small"
                onChange={(ev)=>{data.setModel(ev.target.value);}}
                value={data.model}
                sx={{marginTop: 2,marginBottom:5}}/>
        </>
    )
}

export default ModelDialog