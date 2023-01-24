import React, {Fragment, ReactElement, useState} from "react";
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
    Paper, Tooltip, Avatar, Badge, styled, Stack,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import Icon from "@themes/urlIcon";
// components
import {
    AppointmentFilter,
    PlaceFilter,
    PatientFilter,
    FilterRootStyled,
    RightActionData, ActionBarState, setFilter,
} from "@features/leftActionBar";
import {DrawerBottom} from "@features/drawerBottom";
import {Accordion} from "@features/accordion/components";
// redux
import {useAppDispatch} from "@app/redux/hooks";
import {onOpenPatientDrawer} from "@features/table";
import {LoadingScreen} from "@features/loadingScreen";
import {ConditionalWrapper} from "@app/hooks";
import Zoom from "react-medium-image-zoom";
import IconUrl from "@themes/urlIcon";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import rightActionData from "@features/leftActionBar/components/patient/components/data";

const SmallAvatar = styled(Avatar)(({theme}) => ({
    width: 20,
    height: 20,
    borderRadius: 20,
    border: `2px solid ${theme.palette.background.paper}`
}));

const CardSection = ({...props}) => {
    const {data, theme, onOpenPatientDetails, loading} = props;
    const {data: session} = useSession();
    const router = useRouter();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpPatientPhotoResponse} = useRequest(data?.hasPhoto ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${data?.uuid}/documents/profile-photo/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;

    return (
        <Paper key={Math.random()} className="card-main">
            <Grid container>
                <Grid item xs={12}
                      onClick={() => onOpenPatientDetails(data)}>
                    {loading ? (
                        <Skeleton variant="text" width={140}/>
                    ) : (
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Stack direction={"row"} spacing={1.2}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                    {...(data.nationality && {
                                        badgeContent:
                                            <Tooltip title={data.nationality.nationality}>
                                                <SmallAvatar
                                                    {...(data.hasPhoto && {
                                                        sx: {
                                                            marginRight: -0.2
                                                        }
                                                    })}
                                                    alt={"flag"}
                                                    src={`https://flagcdn.com/${data.nationality.code}.svg`}/>
                                            </Tooltip>
                                    })}
                                >
                                    <ConditionalWrapper
                                        condition={data.hasPhoto}
                                        wrapper={(children: any) => <Zoom>{children}</Zoom>}
                                    >
                                        <Fragment>
                                            <Avatar
                                                {...(data.hasPhoto && {className: "zoom"})}
                                                src={patientPhoto ? patientPhoto : (data?.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg")}
                                                sx={{
                                                    "& .injected-svg": {
                                                        margin: 0
                                                    },
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 1
                                                }}>
                                                <IconUrl width={"36"} height={"36"} path="men-avatar"/>
                                            </Avatar>
                                        </Fragment>
                                    </ConditionalWrapper>
                                </Badge>
                                <Stack direction={"column"}>
                                    <Typography className="heading" variant="body1" component="div">
                                        {data.firstName} {data.lastName}
                                    </Typography>
                                    <Stack direction={"row"} alignItems={"center"}>
                                        <Icon path="ic-anniverssaire" className="d-inline-block mr-1"/>
                                        <Typography
                                            variant={"caption"}>{data.nextAppointment?.dayDate || "-"}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            {!loading && <Grid item>
                                <Button size={"small"} onClick={(event) => event.stopPropagation()}
                                        variant="contained"
                                        startIcon={<PhoneRoundedIcon/>}>
                                    <a className="phone-call" href={`tel:${data?.contact[0]?.code}${data?.contact[0]?.value}`}>
                                        <Typography variant={"body2"}>
                                            <span>{data?.contact[0]?.value}</span>
                                        </Typography>
                                    </a>
                                </Button>
                            </Grid>}
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
                        }}
                    >
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
                            }}
                        >
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
                                component="div"
                            >
                                <Icon path="ic-agenda"/>
                                {data.nextAppointment?.dayDate || "-"}
                                <Icon path="ic-time"/>
                                {data.nextAppointment?.startTime || "-"}
                            </Typography>
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
    const router = useRouter();
    const {collapse} = RightActionData.filter;
    const {t, ready} = useTranslation("patient");

    const [open, setopen] = useState(false);
    const [dataPatient, setDataPatient] =  useState([
        {
            heading: {
                id: collapse[0].heading.title,
                icon: collapse[0].heading.icon,
                title: t(collapse[0].heading.title.toLowerCase()),
            },
            expanded: true,
            children: (
                <FilterRootStyled>
                    <PatientFilter
                        OnSearch={(data: { query: ActionBarState }) => {
                            router.replace('/dashboard/patient?page=1', "/dashboard/patient",
                                {shallow: true}).then(() => {
                                dispatch(setFilter({patient: data.query}));
                            });
                        }}
                        item={{
                            heading: {
                                icon: "ic-patient",
                                title: "patient",
                            },
                            gender: {
                                heading: "gender",
                                genders: ["male", "female"],
                            },
                            textField: {
                                labels: [
                                    {label: "fiche_id", placeholder: "fiche"},
                                    {label: "name", placeholder: "name"},
                                    {label: "birthdate", placeholder: "--/--/----"},
                                    {label: "phone", placeholder: "phone"},
                                ],
                            },
                        }}
                        keyPrefix={"filter."}
                        t={t}/>
                </FilterRootStyled>)
        },
        {
            heading: {
                id: collapse[1].heading.title,
                icon: collapse[1].heading.icon,
                title: t(collapse[1].heading.title.toLowerCase()),
            },
            expanded: true,
            children: (
                <FilterRootStyled>
                    <PlaceFilter
                        OnSearch={(data: { query: ActionBarState }) => {
                            router.replace('/dashboard/patient?page=1', "/dashboard/patient",
                                {shallow: true}).then(() => {
                                dispatch(setFilter({patient: data.query}));
                            });
                            dispatch(setFilter({patient: data.query}));
                        }}
                        item={collapse[1]}
                        t={t} keyPrefix={"filter."}/>
                </FilterRootStyled>
            )
        }
    ]);

    const handleClickOpen = () => {
        setopen(true);
    };


    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <RootStyled>
            {(loading ? Array.from(new Array(5)) : PatientData)?.map((data: any, index: number) => (
                <CardSection
                    {...{data, theme, loading}}
                    key={index}
                    onOpenPatientDetails={(data: PatientModel) => {
                        dispatch(onOpenPatientDrawer({
                            patientId: data.uuid,
                            patientAction: "PATIENT_DETAILS",
                        }));
                        handleEvent("PATIENT_DETAILS", data);
                    }}
                />
            ))}
            <Button
                variant="filter"
                onClick={handleClickOpen}
                className="filter-btn"
                startIcon={<Icon path="ic-filter"/>}
            >
                Filtrer (0)
            </Button>
            <DrawerBottom
                handleClose={() => setopen(false)}
                open={open}
                data="Data"
                title={t("title")}
            >
                <Accordion
                    translate={{t, ready}}
                    data={dataPatient}
                    setData={setDataPatient}
                />
            </DrawerBottom>
        </RootStyled>
    );
}

export default PatientMobileCard;
