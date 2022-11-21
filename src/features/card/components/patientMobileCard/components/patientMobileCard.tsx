import {ReactElement, useState} from "react";
import RootStyled from "./overrides/rootStyled";

// next-i18next
import {useTranslation} from "next-i18next";

// material
import {
    Grid,
    Typography,
    IconButton,
    Button,
    Box,
    Skeleton,
    Paper,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import Icon from "@themes/urlIcon";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

// components
import {
    AppointmentFilter,
    PlaceFilter,
    PatientFilter,
    FilterRootStyled,
    RightActionData,
} from "@features/leftActionBar";
import {Popover} from "@features/popover";
import {DrawerBottom} from "@features/drawerBottom";
import {Accordion} from "@features/accordion/components";

// redux
import {useAppDispatch} from "@app/redux/hooks";
import {onOpenPatientDrawer} from "@features/table";
import {LoadingScreen} from "@features/loadingScreen";

const menuList = [
    {
        title: "Patient Details",
        icon: <CheckRoundedIcon/>,
        action: "onOpenPatientDrawer",
    },
    {
        title: "Edit Patient",
        icon: <CheckRoundedIcon/>,
        action: "onOpenEditPatient",
    },
    {
        title: "Cancel",
        icon: <CheckRoundedIcon/>,
        action: "onCancel",
    },
];

const CardSection = ({...props}) => {
    const {v, theme, onOpenPatientDetails, loading} = props;

    const [openTooltip, setOpenTooltip] = useState(false);
    const onClickTooltipItem = (item: {
        title: string;
        icon: ReactElement;
        action: string;
    }) => {
        switch (item.action) {
            case "onOpenPatientDrawer":
                onOpenPatientDetails({patientId: v.uuid});
                break;

            default:
                break;
        }
    };
    return (
        <Paper key={Math.random()} className="card-main">
            <Grid container>
                <Grid item md={11} sm={11} xs={11}>
                    {loading ? (
                        <Skeleton variant="text" width={140}/>
                    ) : (
                        <>
                            <Typography className="heading" variant="body1" component="div">
                                <Icon path={"ic-f"}/>
                                {v.firstName}
                            </Typography>
                        </>
                    )}

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        component="div"
                        lineHeight="18px"
                    >
                        {loading ? (
                            <Skeleton variant="text" width={100}/>
                        ) : (
                            <>
                                <Icon path="ic-anniverssaire" className="d-inline-block mr-1"/>
                                {v.nextAppointment?.dayDate || "-"}
                            </>
                        )}
                    </Typography>
                    <Box
                        className="border-left-sec"
                        sx={{
                            borderLeft: `5px solid ${
                                v?.isParent
                                    ? theme.palette.success.main
                                    : theme.palette.warning.main
                            }`,
                        }}
                    >
                        <Button
                            size="small"
                            className="button"
                            startIcon={
                                v?.isParent ? (
                                    <Icon path="ic-agenda"/>
                                ) : (
                                    <Icon path="ic-historique"/>
                                )
                            }
                            sx={{
                                color: v?.isParent ? "primary" : "text.secondary",
                            }}
                        >
                            {loading ? (
                                <Skeleton variant="text" width={100}/>
                            ) : v.isParent ? (
                                "Add Apointment"
                            ) : (
                                "Next Appointment"
                            )}
                        </Button>
                        {!loading && !v.isParent && (
                            <Typography
                                display="inline"
                                variant="body2"
                                color="text.primary"
                                className="date-time-text"
                                component="div"
                            >
                                <Icon path="ic-agenda"/>
                                {v.nextAppointment?.dayDate || "-"}
                                <Icon path="ic-time"/>
                                {v.nextAppointment?.startTime || "-"}
                            </Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item md={1} sm={1} xs={1}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="end"
                        height="100%"
                    >
                        <Popover
                            open={openTooltip}
                            handleClose={() => setOpenTooltip(false)}
                            menuList={menuList}
                            onClickItem={onClickTooltipItem}
                            button={
                                loading ? (
                                    <Skeleton variant="circular" width={20} height={20}/>
                                ) : (
                                    <IconButton
                                        onClick={() => {
                                            setOpenTooltip(true);
                                        }}
                                        sx={{display: "block", ml: "auto"}}
                                        size="small"
                                    >
                                        <Icon path="more-vert"/>
                                    </IconButton>
                                )
                            }
                        />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

function PatientMobileCard({...props}) {
    const {PatiendData, loading} = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const [open, setopen] = useState(false);

    const handleClickOpen = () => {
        setopen(true);
    };
    const {collapse} = RightActionData.filter;
    const {t, ready} = useTranslation("patient", {keyPrefix: "filter"});

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    const data = collapse.map((item) => {
        return {
            heading: {
                id: item.heading.title,
                icon: item.heading.icon,
                title: item.heading.title,
            },
            children: (
                <FilterRootStyled>
                    {item.heading.title === "patient" ? (
                        <PatientFilter item={item} t={t}/>
                    ) : item.heading.title === "place" ? (
                        <PlaceFilter item={item} t={t}/>
                    ) : (
                        <AppointmentFilter item={item} t={t}/>
                    )}
                </FilterRootStyled>
            ),
        };
    });

    return (
        <RootStyled>
            {(loading ? Array.from(new Array(5)) : PatiendData)?.map((v: any) => (
                <CardSection
                    v={v}
                    key={Math.random()}
                    theme={theme}
                    onOpenPatientDetails={(val: { patientId: number | string }) => {
                        dispatch(onOpenPatientDrawer(val));
                    }}
                    loading={loading}
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
                    badge={null}
                    data={data}
                    defaultValue={"patient"}
                />
            </DrawerBottom>
        </RootStyled>
    );
}

export default PatientMobileCard;
