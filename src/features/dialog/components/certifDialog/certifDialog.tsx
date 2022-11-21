import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {Box, TextField, Typography} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";

function CertifDialog({...props}) {

    const {data} = props
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        data.state.content = `Je soussigné, Dr ${data.state.name} certifie avoir examiné ce  jour : ${data.state.patient} et que son etat de sante necessite un repos de ${data.state.days} jour(s) a compter de ce jour, sauf complications ulterieures`
        setValue(data.state.content)
        data.setState(data.state)
    }, [data])
    const {t, ready} = useTranslation("settings");
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <Box>
            <Typography variant="subtitle1"
                        fontWeight={600}
                        marginTop={4}
                        align={"center"}
                        letterSpacing={2}
                        marginBottom={2}>
                {t('CERTIFICAT MEDICAL')}
            </Typography>
            <Box>
                <TextField
                    multiline
                    rows={10}
                    style={{width:"100%"}}
                    value={value}
                    onChange={(ev)=>{
                        setValue(ev.target.value)
                        data.state.content =ev.target.value;
                        data.setState(data.state)

                    }}
                />
            </Box>
        </Box>
    )
}

export default CertifDialog
