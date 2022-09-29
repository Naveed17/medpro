import {CheckList} from "@features/checkList";
import {useTranslation} from "next-i18next";
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import React, {SetStateAction, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {
    Box,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import IconUrl from "@themes/urlIcon";

function CertifDialog({...props}) {

    const { data } =  props
    const [value, setValue] = useState<string>('');
    const [patient, setPatient] = useState<string>(data.state.patient)
    const [days, setDays] = useState<string>(data.state.days)

    useEffect(() => {
        data.state.content = `Je soussigné, Dr ${data.state.name} certifie avoir examiné ce  jour : ${patient} et que son etat de sante necessite un repos de ${days} jour(s) a compter de ce jour, sauf complications ulterieures`
        setValue(data.state.content)
        data.setState(data.state)
    }, [data, days, patient])
    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    return (
        <Grid container spacing={5} height={'100%'} marginTop={0}>
            <Grid item xs={12} md={8} sx={{borderRight: '1px solid gray'}}>
                <Typography variant="subtitle1"
                            fontWeight={600}
                            marginTop={4}
                            align={"center"}
                            letterSpacing={2}
                            marginBottom={2}>
                    {t('CERTIFICAT MEDICAL')}
                </Typography>
                <Box>
                    <div style={{
                        fontSize: 20,
                        lineHeight: 1.9,
                        textAlign: "center",
                        marginTop: 30,
                        letterSpacing: 3
                    }} dangerouslySetInnerHTML={{__html: value}} />
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight={600} marginTop={4}>
                    {t('Variables')}
                </Typography>
                <Typography color={"gray"} fontSize={12}>Modifier les champs en cas de besoin</Typography>

                <List>
                    <Typography marginTop={3} marginBottom={1} fontSize={13}>Nom du patient</Typography>

                        <TextField
                            id="outlined-multiline-flexible"
                            sx={{width: '100%'}}
                            value={patient}
                            onChange={(ev)=>{
                                setPatient(ev.target.value)
                                data.state.patient =ev.target.value;
                                data.setState(data.state)
                            }}
                        />
                    <Typography marginTop={3} marginBottom={1} fontSize={13}>Nombre des jours</Typography>
                        <TextField
                            id="outlined-multiline-flexible"
                            type={"number"}
                            sx={{width: '100%'}}
                            value={days}
                            onChange={(ev)=>{
                                setDays(ev.target.value)
                                data.state.days =ev.target.value;
                                data.setState(data.state)

                            }}
                        />
                </List>
            </Grid>
        </Grid>
    )
}

export default CertifDialog
