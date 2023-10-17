import React from "react";
import PatientHistoryCardStyled
    from "@features/card/components/patientHistoryCard/components/overrides/PatientHistoryCardStyle";
import {CardContent, Chip, IconButton, Stack, Typography, useMediaQuery} from "@mui/material";
import Icon from "@themes/urlIcon";
import {capitalize} from "lodash";
import moment from "moment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {Theme} from "@mui/material/styles";
import {useRouter} from "next/router";
import {consultationSelector, SetSelectedApp} from "@features/toolbar";
import {useAppSelector} from "@lib/redux/hooks";
import CircleIcon from '@mui/icons-material/Circle';

function AppointmentHistoryPreview({...props}) {
    const {children, app, appuuid, dispatch, t, mini} = props;

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const router = useRouter();

    const {selectedApp} = useAppSelector(consultationSelector);

    const handleConsultation = () => {
        const slugConsultation = `/dashboard/consultation/${app.uuid}`;
        if (router.asPath !== slugConsultation) {
            router.replace(slugConsultation, slugConsultation, {locale: router.locale});
        }
    }

    return (
        <PatientHistoryCardStyled
            style={{
                border: app.uuid === appuuid ? "2px solid #FFD400" : app.uuid !== appuuid ? 0 : "",
                opacity: selectedApp === "" || app.uuid === selectedApp ? 1 : 0.7
            }}>
            <Stack
                className="card-header"
                p={2}
                direction="row"
                id={`x${app.uuid}`}
                justifyContent={"space-between"}
                alignItems="center"
                onClick={() => {
                    app.uuid === selectedApp
                        ? dispatch(SetSelectedApp(""))
                        : dispatch(SetSelectedApp(app.uuid));
                    const el = document.getElementById(`x${app.uuid}`)

                        if (el)
                            document.getElementById('histo')?.scrollTo({
                                top: el?.offsetTop-235,
                                behavior: "smooth",
                            });
                }
                }
                borderBottom={1}
                borderColor="divider">
                {!isMobile && <Typography
                    display="flex"
                    alignItems="center"
                    component="div"
                    sx={{cursor: "pointer"}}
                    fontWeight={600}>
                    <Icon path={"ic-doc"}/>
                    {capitalize(t("reason_for_consultation"))}{" "}
                    {app.consultationReason.length > 0 ? (
                        <>: {app.consultationReason.map((reason: ConsultationReasonModel) => reason.name).join(", ")}</>
                    ) : (
                        <>: --</>
                    )}
                </Typography>}
                <Stack ml="auto" direction={"row"} spacing={1} alignItems={"center"}>
                    {!mini && <Chip icon={<CircleIcon style={{color: `${app.type.color}`}}/>} size={"small"}
                                    label={app.type.name} color={"info"}/>}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{cursor: "pointer"}}
                        textTransform={"capitalize"}>
                        {moment(app.date, "DD-MM-YYYY").format(
                            "ddd DD-MM-YYYY"
                        )}{" "}
                        <AccessTimeIcon
                            style={{marginBottom: "-3px", width: 20, height: 15}}
                        />{" "}
                        {app.time}
                    </Typography>
                    <IconButton onClick={() => {
                        handleConsultation();
                    }}>
                        <OpenInNewIcon style={{color: "white", fontSize: 20}}/>
                    </IconButton>
                </Stack>
            </Stack>
            <CardContent
                style={{padding: 0}}>
                {children}
            </CardContent>
        </PatientHistoryCardStyled>
    )
}

export default AppointmentHistoryPreview;
