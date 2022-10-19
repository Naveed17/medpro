import React from "react";
import {CardContent, Stack, Typography} from "@mui/material";
import PatientHistoryCardStyled from "./overrides/PatientHistoryCardStyle";
import {capitalize} from "lodash";
import Icon from "@themes/urlIcon";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import moment from "moment/moment";

function PatientHistoryCard({...props}) {
    const {
        keyID,
        data,
        appuuid,
        t,
        children,
    } = props
    return (
        <div id={keyID}>
            <PatientHistoryCardStyled
                style={{
                    border: data.appointment.uuid === appuuid ? "2px solid #FFD400" : "",
                }}>
                <Stack
                    className="card-header"
                    p={2}
                    direction="row"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="divider">
                    <Typography
                        display="flex"
                        alignItems="center"
                        component="div"
                        fontWeight={600}>
                        <Icon path={"ic-doc"}/>
                        {capitalize(t("reason_for_consultation"))}{" "}
                        {data?.appointment.consultationReason ? (
                            <>: {data?.appointment.consultationReason.name}</>
                        ) : (
                            <>: --</>
                        )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" ml="auto" textTransform={"capitalize"}>
                        {moment(data?.appointment.dayDate, 'DD-MM-YYYY').format('ddd DD-MM-YYYY')} <AccessTimeIcon
                        style={{marginBottom: '-3px', width: 20, height: 15}}/> {data?.appointment.startTime}
                    </Typography>
                </Stack>
                <CardContent>{children}</CardContent>
            </PatientHistoryCardStyled>
        </div>
    );
}

export default PatientHistoryCard;
