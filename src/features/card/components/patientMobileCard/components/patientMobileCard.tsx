import React from "react";
import RootStyled from "./overrides/rootStyled";
// next-i18next
import {useTranslation} from "next-i18next";
// material
import {
    Avatar,
    Badge,
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    styled,
    Tooltip,
    Typography,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import IconUrl from "@themes/urlIcon";
// redux
import {useAppDispatch} from "@lib/redux/hooks";
import {onOpenPatientDrawer} from "@features/table";
import {LoadingScreen} from "@features/loadingScreen";
import {useProfilePhoto} from "@lib/hooks/rest";

const SmallAvatar = styled(Avatar)(({theme}) => ({
    width: 20,
    height: 20,
    borderRadius: 20,
    border: `2px solid ${theme.palette.background.paper}`,
}));

const CardSection = ({...props}) => {
    const {data, theme, onOpenPatientDetails, loading} = props;
    const {patientPhoto} = useProfilePhoto({patientId: data?.uuid, hasPhoto: data?.hasPhoto});

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
                                                ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url
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
                                        <IconUrl
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
                                    <IconUrl path="ic-agenda"/>
                                ) : (
                                    <IconUrl path="ic-historique"/>
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
                                <IconUrl path="ic-agenda"/>
                                {data.nextAppointment?.dayDate || "-"}
                                <IconUrl path="ic-time"/>
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
                color={"error"}
                button
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
