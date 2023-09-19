import {CardContent, Stack, TextField, Typography, useTheme} from "@mui/material";
import React, {memo, useEffect, useState} from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import moment from "moment/moment";
import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";

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

    const {data: httpAppointmentDataResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${patient_uuid}/appointment-data/${router.locale}`
    }, SWRNoValidateConfig);

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
                        <Typography
                            fontSize={12}>{t("consultationIP.notes")} : {act.note ? act.note.map((item: any) => item.value).join(",") : '-'}</Typography>
                        <Typography
                            fontSize={12}>{t("consultationIP.diagnosis")} : {act.diagnostics ? act.diagnostics.map((item: any) => item.value).join(",") : '-'}</Typography>
                    </Stack>
                </CardContent>
            ))}
        </>
    )
}

export default ObservationHistoryDialog;
