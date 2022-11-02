import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {Box, TextField, Typography} from "@mui/material";

function ReportDialog({...props}) {

    const {data} = props
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        data.state.content = ''
        setValue(data.state.content)
        data.setState(data.state)
    }, [data])
    const {t, ready} = useTranslation("consultation");
    if (!ready) return (<>loading translations...</>);

    return (
        <Box>
            <Typography variant="subtitle1"
                        fontWeight={600}
                        marginTop={4}
                        align={"center"}
                        letterSpacing={2}
                        marginBottom={2}>
                {t('RAPPORT MEDICAL')}
            </Typography>
            <Box>
                <TextField
                    multiline
                    rows={10}
                    style={{width:"100%"}}
                    value={value}
                    placeholder={t('consultationIP.reportPlaceholder')}
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

export default ReportDialog
