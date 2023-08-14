import {CardContent, Stack, TextField, Typography, useTheme} from "@mui/material";
import React, {memo} from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import moment from "moment/moment";

export const MyTextInput: any = memo(({...props}) => {
    return (
        <TextField {...props} />
    );
})
MyTextInput.displayName = "TextField";

function ObservationHistoryDialog({...props}) {
    const {data: {stateHistory, t}} = props;
    const theme = useTheme();
    console.log('stateHistory', stateHistory);

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
