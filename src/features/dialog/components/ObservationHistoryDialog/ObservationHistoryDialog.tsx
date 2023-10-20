import {CardContent, Stack, TextField, Typography, useTheme} from "@mui/material";
import React, {memo, useEffect, useState} from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import moment from "moment/moment";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

export const MyTextInput: any = memo(({...props}) => {
    return (
        <TextField {...props} />
    );
})
MyTextInput.displayName = "TextField";

function ObservationHistoryDialog({...props}) {
    const {data: {patient_uuid, t}} = props;

    const theme = useTheme();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const [stateHistory, setStateHistory] = useState<any[]>([]);

    const {data: httpAppointmentDataResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${patient_uuid}/appointment-data/${router.locale}`
    }, ReactQueryNoValidateConfig);

    useEffect(() => {
        if (httpAppointmentDataResponse) {
            const appointmentDataHistory = (httpAppointmentDataResponse as HttpResponse)?.data;

            const groupsDiagnostics: any = appointmentDataHistory.diagnostics?.group((diag: any) => diag.date);
            const groupsNotes: any = appointmentDataHistory.notes?.group((diag: any) => diag.date);
            let notes: any[] = [];
            if (groupsDiagnostics)
                Object.entries(groupsDiagnostics).forEach((diag: any) => notes[diag[0]] = {
                    ...notes[diag[0]],
                    diagnostics: diag[1]
                });
            if (groupsNotes)
                Object.entries(groupsNotes).forEach((note: any) => notes[note[0]] = {...notes[note[0]], note: note[1]});

            setStateHistory(Object.entries(notes).map((data) => ({
                data: data[0],
                note: data[1]?.note,
                diagnostics: data[1]?.diagnostics
            })));
        }
    }, [httpAppointmentDataResponse])

    return (
        <>
            {stateHistory.map((act: any, index: number) => (
                <CardContent
                    style={{border: `1px solid ${theme.palette.grey['A300']}`, marginBottom: 5, borderRadius: 10}}
                    key={`${index}-history-row`}>
                    <Stack spacing={1}>
                        <Stack
                            spacing={1}
                            direction="row"
                            alignItems="center">
                            <AccessTimeIcon style={{fontSize: 13}}/>
                            <Typography style={{
                                fontSize: 12,
                                fontWeight: "bold"
                            }}>{moment(act.data, 'DD-MM-YYYY').format('DD/MM/YYYY')}</Typography>
                        </Stack>
                        <div dangerouslySetInnerHTML={{__html:`${t("consultationIP.notes")} : ${act.note ? act.note.map((item: any) => item.value).join(",") : '-'}`}}></div>
                        <div dangerouslySetInnerHTML={{__html:`${t("consultationIP.diagnosis")} : ${act.diagnostics ? act.diagnostics.map((item: any) => item.value).join(",") : '-'}`}}></div>
                    </Stack>
                </CardContent>
            ))}
        </>
    )
}

export default ObservationHistoryDialog;
