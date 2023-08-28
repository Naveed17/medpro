import React, {useEffect, useState} from "react";
import {Button, Stack, Typography} from "@mui/material";
import AddRequestQuoteDialogStyle from "./overrides/addRequestQuoteDialogStyle";

import {useTranslation} from "next-i18next";
import {useRequest} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {FeesTab} from "@features/tabPanel";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";

import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";

function AddRequestQuoteDialog({...props}) {

    const {data} = props;
    const {acts, setActs} = data
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {t} = useTranslation("consultation");

    const [total, setTotal] = useState(0);
    const {medical_professional} = useMedicalProfessionalSuffix();

    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;

    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const {data: httpProfessionalsActs, mutate: mutateActs} = useRequest(medical_professional ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    } : null, SWRNoValidateConfig);

    useEffect(() => {
        if (httpProfessionalsActs) {
            let _acts: AppointmentActModel[] = [];
            (httpProfessionalsActs as HttpResponse)?.data.forEach((act: any) => {
                const act_index = _acts.findIndex(_act => _act.uuid === act.uuid)
                if (act_index > -1) {
                    _acts[act_index] = {
                        ..._acts[act_index],
                        selected: false,
                        qte: act.qte ? act.qte : 1,
                        fees: act.fees
                    }
                } else {
                    _acts.push({
                        act: {name: act.act.name},
                        fees: act.fees,
                        isTopAct: false,
                        qte: act.qte ? act.qte : 1,
                        selected: false,
                        uuid: act.uuid
                    })
                }
            })
            setActs(_acts);
        }
    }, [httpProfessionalsActs]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <AddRequestQuoteDialogStyle>
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
                editAct,
                setTotal,
                total,
                devise,
                t
            }}
                     isQuoteRequest={true}
            />

        </AddRequestQuoteDialogStyle>
    );
}

export default AddRequestQuoteDialog;