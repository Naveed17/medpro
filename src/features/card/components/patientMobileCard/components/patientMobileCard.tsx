import React, {useState} from "react";
import RootStyled from "./overrides/rootStyled";
// next-i18next
import {useTranslation} from "next-i18next";

// material
import {
    Grid,
    Typography,
    Button,
    Box,
    Skeleton,
    Paper,
    Tooltip,
    Avatar,
    Badge,
    styled,
    Stack,
    IconButton,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import Icon from "@themes/urlIcon";
// redux
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {onOpenPatientDrawer} from "@features/table";
import {LoadingScreen} from "@features/loadingScreen";
import IconUrl from "@themes/urlIcon";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {Popover} from "@features/popover";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@app/hooks";

const menuList = [
    {
        title: "add_appointment",
        icon: <IconUrl path="ic-plus" color="white" width={18} height={18}/>,
        action: "onAddAppointment",
    },
    {
        title: "event.start",
        icon: <PlayCircleIcon/>,
        action: "onStartAppointment",
    },
    {
        title: "add_to_waiting_room",
        icon: <IconUrl path="ic-salle"/>,
        action: "onOpenPatientDrawer",
    },
    {
        title: "import_document",
        icon: (
            <IconUrl path="ic-dowlaodfile" color="white" width={18} height={18}/>
        ),
        action: "onImportFile",
    },

    {
        title: "delete_appointment",
        icon: <IconUrl path="icdelete" color="white" width={18} height={18}/>,
        action: "onDelete",
    },
];
const SmallAvatar = styled(Avatar)(({theme}) => ({
    width: 20,
    height: 20,
    borderRadius: 20,
    border: `2px solid ${theme.palette.background.paper}`,
}));

const CardSection = ({...props}) => {
    const {data, theme, onOpenPatientDetails, loading} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpPatientPhotoResponse} = useRequest(medicalEntityHasUser && data?.hasPhoto ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${data?.uuid}/documents/profile-photo/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        }
    } : null, SWRNoValidateConfig);

    const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;

    return (
        <Paper key={Math.random()} className="card-main">
            <Grid container>
                <Grid item xs={12} onClick={() => onOpenPatientDetails(data)}>
                    {loading ? (
                        <Skeleton variant="text" width={140}/>
                    ) : (
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Stack direction={"row"} spacing={1.2}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                                    {...(data.nationality && {
                                        badgeContent: (
                                            <Tooltip title={data.nationality.nationality}>
                                                <SmallAvatar
                                                    {...(data.hasPhoto && {
                                                        sx: {
                                                            marginRight: -0.2,
                                                        },
                                                    })}
                                                    alt={"flag"}
                                                    src={`https://flagcdn.com/${data.nationality.code}.svg`}
                                                />
                                            </Tooltip>
                                        ),
                                    })}>
                                    <Avatar
                                        {...(data.hasPhoto && {className: "zoom"})}
                                        src={
                                            patientPhoto
                                                ? patientPhoto
                                                : data?.gender === "M"
                                                    ? "/static/icons/men-avatar.svg"
                                                    : "/static/icons/women-avatar.svg"
                                        }
                                        sx={{
                                            "& .injected-svg": {
                                                margin: 0,
                                            },
                                            width: 36,
                                            height: 36,
                                            borderRadius: 1,
                                        }}>
                                        <IconUrl width={"36"} height={"36"} path="men-avatar"/>
                                    </Avatar>
                                </Badge>
                                <Stack direction={"column"}>
                                    <Typography
                                        className="heading"
                                        variant="body1"
                                        component="div">
                                        {data.firstName} {data.lastName}
                                    </Typography>
                                    <Stack direction={"row"} alignItems={"center"}>
                                        <Icon
                                            path="ic-anniverssaire"
                                            className="d-inline-block mr-1"
                                        />
                                        <Typography variant={"caption"}>
                                            {data.nextAppointment?.dayDate || "-"}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            {/* <Popover
                open={openTooltip}
                handleClose={() => setOpenTooltip(false)}
                menuList={menuList}
                className="agenda-rdv-details"
                onClickItem={(itempopver: {
                  title: string;
                  icon: string;
                  action: string;
                }) => {
                  setOpenTooltip(false);
                  console.log(itempopver);
                }}
                button={
                  <IconButton
                    disableRipple
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setOpenTooltip(true);
                    }}
                    sx={{ display: "block", ml: "auto" }}
                    size="small">
                    <Icon path="more-vert" />
                  </IconButton>
                }
              />*/}
                        </Stack>
                    )}

                    <Box
                        className="border-left-sec"
                        sx={{
                            borderLeft: `5px solid ${
                                data?.isParent
                                    ? theme.palette.success.main
                                    : theme.palette.warning.main
                            }`,
                        }}>
                        <Button
                            size="small"
                            className="button"
                            startIcon={
                                data?.isParent ? (
                                    <Icon path="ic-agenda"/>
                                ) : (
                                    <Icon path="ic-historique"/>
                                )
                            }
                            sx={{
                                color: data?.isParent ? "primary" : "text.secondary",
                            }}>
                            {loading ? (
                                <Skeleton variant="text" width={100}/>
                            ) : data.isParent ? (
                                "Add Apointment"
                            ) : (
                                "Next Appointment"
                            )}
                        </Button>
                        {!loading && !data.isParent && (
                            <Typography
                                display="inline"
                                variant="body2"
                                color="text.primary"
                                className="date-time-text"
                                component="div">
                                <Icon path="ic-agenda"/>
                                {data.nextAppointment?.dayDate || "-"}
                                <Icon path="ic-time"/>
                                {data.nextAppointment?.startTime || "-"}
                            </Typography>
                        )}
                        {!loading && (
                            <IconButton
                                size="small"
                                className="btn-phone"
                                LinkComponent="a"
                                href={`tel:${data?.contact[0]?.code}${data?.contact[0]?.value}`}
                                onClick={(event) => event.stopPropagation()}>
                                <IconUrl path="ic-tel"/>
                            </IconButton>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

function PatientMobileCard({...props}) {
    const {PatientData, handleEvent, loading} = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {t, ready} = useTranslation("patient");

    if (!ready)
        return (
            <LoadingScreen
                error
                button={"loading-error-404-reset"}
                text={"loading-error"}
            />
        );

    return (
        <RootStyled>
            {(loading ? Array.from(new Array(5)) : PatientData)?.map(
                (data: any, index: number) => (
                    <CardSection
                        {...{data, theme, loading}}
                        key={index}
                        onOpenPatientDetails={(data: PatientModel) => {
                            dispatch(
                                onOpenPatientDrawer({
                                    patientId: data.uuid,
                                    patientAction: "PATIENT_DETAILS",
                                })
                            );
                            handleEvent("PATIENT_DETAILS", data);
                        }}
                    />
                )
            )}
        </RootStyled>
    );
}

export default PatientMobileCard;
