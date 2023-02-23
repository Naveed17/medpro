import React from "react";
import {CardContent, IconButton, Stack, Theme, Typography, useMediaQuery, useTheme,} from "@mui/material";
import PatientHistoryCardStyled from "./overrides/PatientHistoryCardStyle";
import {capitalize} from "lodash";
import Icon from "@themes/urlIcon";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import moment from "moment/moment";
import {SetSelectedApp} from "@features/toolbar";
import {useRouter} from "next/router";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function PatientHistoryCard({...props}) {
    const {keyID, data, appuuid, selectedApp, dispatch, t, children, closePatientDialog = null} = props;
    const theme: Theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();

    const handleConsultation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        closePatientDialog && closePatientDialog();
        const slugConsultation = `/dashboard/consultation/${keyID}`;
        router.replace(slugConsultation, slugConsultation, {locale: router.locale});
    }

    return (
        <div id={keyID}>
            <PatientHistoryCardStyled
                style={{
                    border:
                        data.appointment.uuid === appuuid
                            ? "2px solid #FFD400"
                            : data.appointment.uuid !== selectedApp
                                ? 0
                                : "",
                }}>
                <Stack
                    className="card-header"
                    p={2}
                    direction="row"
                    alignItems="center"
                    onClick={() => {
                        keyID === selectedApp
                            ? dispatch(SetSelectedApp(""))
                            : dispatch(SetSelectedApp(keyID));
                    }}
                    borderBottom={1}
                    borderColor="divider">
                    <Typography
                        display="flex"
                        alignItems="center"
                        component="div"
                        sx={{cursor: "pointer"}}
                        fontWeight={600}>
                        <Icon path={"ic-doc"}/>
                        {!isMobile && capitalize(t("reason_for_consultation"))}{" "}
                        {data?.appointment.consultationReason ? (
                            <>: {data?.appointment.consultationReason.name}</>
                        ) : (
                            <>: --</>
                        )}
                    </Typography>
                    <Stack ml="auto" direction={"row"} spacing={1} alignItems={"center"}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{cursor: "pointer"}}
                            textTransform={"capitalize"}>
                            {moment(data?.appointment.dayDate, "DD-MM-YYYY").format(
                                "ddd DD-MM-YYYY"
                            )}{" "}
                            <AccessTimeIcon
                                style={{marginBottom: "-3px", width: 20, height: 15}}
                            />{" "}
                            {data?.appointment.startTime}
                        </Typography>
                        <IconButton onClick={(e) => {
                            handleConsultation(e);
                        }}>
                            <OpenInNewIcon style={{color: "white", fontSize: 20}}/>
                        </IconButton>
                    </Stack>
                </Stack>
                <CardContent
                    style={{padding: data.appointment.uuid !== selectedApp ? 0 : ""}}>
                    {children}
                </CardContent>
            </PatientHistoryCardStyled>
        </div>
    );
}

export default PatientHistoryCard;
