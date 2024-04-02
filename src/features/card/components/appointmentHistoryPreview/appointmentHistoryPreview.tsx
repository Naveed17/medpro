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
import IconUrl from "@themes/urlIcon";
import {Label} from "@features/label";

function AppointmentHistoryPreview({...props}) {
    const {children, app, appuuid, dispatch, t, mini, handleDeleteApp} = props;

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
                            top: el?.offsetTop - 235,
                            behavior: "smooth",
                        });
                }
                }
                borderBottom={1}
                borderColor="divider">
                {!isMobile &&
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                        <Icon path={"ic-white-docs"} width={20} height={20}/>
                        <Typography
                            display="flex"
                            alignItems="center"
                            component="div"
                            sx={{cursor: "pointer"}}
                            fontWeight={600}>
                            {capitalize(t("reason_for_consultation"))}{" "}
                            {app.consultationReason.length > 0 ? (
                                <>: {app.consultationReason.map((reason: ConsultationReasonModel) => reason.name).join(", ")}</>
                            ) : (
                                <>: --</>
                            )}
                        </Typography>
                    </Stack>}
                <Stack ml="auto" direction={"row"} spacing={1}
                       alignItems={"center"} {...(isMobile && {justifyContent: "space-between", width: "100%"})}>
                    {!mini && <Label variant={"filled"} color={"white"}>{app.type.name}</Label>}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{cursor: "pointer"}}
                        textTransform={"capitalize"}>
                        {moment(app.date, "DD-MM-YYYY").format(
                            "ddd DD-MM-YYYY"
                        )}{" "}
                        {!isMobile && <AccessTimeIcon
                            style={{marginBottom: "-3px", width: 20, height: 15}}
                        />}{" "}
                        {!isMobile && app.time}
                    </Typography>
                    {app.uuid !== appuuid && <Stack direction={"row"} alignItems={"center"} pl={2}>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation()
                                handleConsultation();
                            }}>
                            <IconUrl path={"ic-re-open"} color={"white"} width={18} height={18}/>
                        </IconButton>
                        <IconButton
                            sx={{mt: -.3}}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteApp();
                            }}>
                            <IconUrl path={"ic-trash"} color={"white"} width={20} height={20}/>
                        </IconButton>
                    </Stack>}
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
