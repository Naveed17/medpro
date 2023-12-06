import React, {useEffect, useState} from "react";
import {Button, Stack, TextField, Typography} from "@mui/material";
import AddRequestQuoteDialogStyle from "./overrides/addRequestQuoteDialogStyle";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {FeesTab} from "@features/tabPanel";

import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";

function AddRequestQuoteDialog({...props}) {

    const {data} = props;
    const {acts, setActs, note, setNotes} = data
    const {data: session} = useSession();
    const {t} = useTranslation("consultation");

    const [total, setTotal] = useState(0);

    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;

    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    useEffect(() => {
        let _total = 0
        acts.filter((act: AppointmentActModel) => act.selected).forEach((act: AppointmentActModel) => _total += act.fees * act.qte)
        setTotal(_total);
    }, [acts])

    const editAct = (row: any, from: any) => {
        const act_index = acts.findIndex((act: AppointmentActModel) => act.uuid === row.uuid);
        const updatedActs = [...acts];

        if (from === 'check') {
            updatedActs[act_index] = {
                ...updatedActs[act_index],
                selected: !updatedActs[act_index].selected,
            };
        } else if (from === 'change') {
            updatedActs[act_index] = row;
        }
        setActs(updatedActs);
    };


    return (
        <AddRequestQuoteDialogStyle spacing={0}>
            <Stack direction={"row"} justifyContent={"end"} mb={2}>
                <Button size='small'
                        variant='contained'
                        color={"success"}>
                    {t("total")}
                    <Typography fontWeight={700} component='strong'
                                mx={1}>{total}</Typography>
                    {devise}
                </Button>
            </Stack>
            <FeesTab {...{
                acts,
                setActs,
                total,
                setTotal,
                editAct,
                devise,
                t
            }}
                     isQuoteRequest={true}
            />



            <Stack style={{
                position:"absolute",
                bottom:74,
                right:0,
                width:"100%",
                background:"white",
                padding:10
            }}>
                <TextField value={note}
                           placeholder={'notes..'}
                           onChange={(e) => setNotes(e.target.value)}/>
            </Stack>
        </AddRequestQuoteDialogStyle>
    );
}

export default AddRequestQuoteDialog;