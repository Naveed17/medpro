import {GetStaticProps, GetStaticPaths} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState, useEffect} from "react";
import {SubHeader} from "@features/subHeader";
import {useTranslation} from "next-i18next";
import {
    Avatar,
    ListItemIcon,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    List,
    ListItem,
    Stack,
    Typography,
    ListItemText,
    Link
} from "@mui/material";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
    timelineOppositeContentClasses,
    TimelineDot
} from '@mui/lab';
import {Label} from "@features/label"
import {useRouter} from "next/router";
import {DashLayout} from "@features/base";
import dynamic from "next/dynamic";
import {LoadingScreen} from "@features/loadingScreen";
import {ConditionalWrapper, useMedicalEntitySuffix} from "@lib/hooks";
import Zoom from "react-medium-image-zoom";
import IconUrl from "@themes/urlIcon";
import {ChartsOption, ChartStyled} from "@features/charts";
import {merge} from 'lodash';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {Dialog} from "@features/dialog";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import {toggleSideBar} from "@features/menu";
import {useAppDispatch} from "@lib/redux/hooks";
import {useRequestQuery} from "@lib/axios";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

function StaffDetails() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready, i18n} = useTranslation("staff", {keyPrefix: "config"});

    const [openPersonalInfo, setOpenPersonalInfo] = useState(false);
    const [openEmploymentDetails, setOpenEmploymentDetails] = useState(false);
    const [openScheduledShifts, setOpenScheduledShifts] = useState<boolean>(false);
    const [openAssignment, setOpenAssignment] = useState<boolean>(false)

    const error = false;
    const userUuid = router.query["uuid"];

    const {data: httpUsersResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/admin/users/${userUuid}/${router.locale}`
    }, {
        refetchOnWindowFocus: false
    });

    const handleCloseEmploymentDetails = () => setOpenEmploymentDetails(false);
    const handleClosePersonalInfo = () => setOpenPersonalInfo(false);
    const handleCloseScheduledShifts = () => setOpenScheduledShifts(false);
    const handleCloseAssignment = () => setOpenAssignment(false);

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["doctors"]);
        dispatch(toggleSideBar(true));
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready || error) {
        return <LoadingScreen
            button
            {...(error ? {
                OnClick: () => router.push('/admin/staff'),
                text: 'loading-error-404-reset'
            } : {})}
        />
    }

    return (
        <>
            <SubHeader>
                <Stack
                    direction={{xs: 'column', md: 'row'}}
                    justifyContent="space-between"
                    width={1}
                    alignItems={{xs: 'flex-start', md: 'center'}}>
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                        {t("sub-header.profile_title")}
                    </Typography>
                    <Button variant={"text"} onClick={() => router.back()} startIcon={<ArrowBackIosRoundedIcon/>}>
                        {t("back_staff")}
                    </Button>
                </Stack>
            </SubHeader>

            <Box className="container">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={2}>
                            <Card sx={{overflow: 'visible'}}>
                                <CardContent>
                                    <ConditionalWrapper
                                        condition={false}
                                        wrapper={(children: any) => <Zoom>{children}</Zoom>}>
                                        <Stack alignItems='center' spacing={1.5}>
                                            <Avatar
                                                {...(({className: "zoom"}))}
                                                src={"/static/icons/men-avatar.svg"}
                                                sx={{
                                                    "& .injected-svg": {
                                                        margin: 0
                                                    },
                                                    width: 75,
                                                    height: 75,
                                                    borderRadius: 2

                                                }}>
                                                <IconUrl width={75} height={75} path="men-avatar"/>
                                            </Avatar>
                                            <Stack alignItems="center">
                                                <Typography variant="subtitle2" fontWeight={700} color='primary'>
                                                    Mme Salme Rezgui
                                                </Typography>
                                                <Typography variant="body2">
                                                    Secretaire
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </ConditionalWrapper>
                                    <Stack mt={2.5}>
                                        <Stack width={1} mb={1} direction='row' alignItems='center'
                                               justifyContent='space-between'>
                                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                                {t("personal_info")}
                                            </Typography>
                                            <IconButton onClick={() => setOpenPersonalInfo(true)} size="small"
                                                        sx={{border: 1, borderColor: "divider", borderRadius: 1}}>
                                                <IconUrl width={20} height={20} path="ic-edit-pen"/>
                                            </IconButton>
                                        </Stack>
                                        <List disablePadding>
                                            <ListItem disablePadding sx={{py: .7}}>
                                                <Typography width={140} minWidth={140} variant="body2"
                                                            color='text.secondary'>
                                                    {t("full_name")}
                                                </Typography>
                                                <Typography fontWeight={500}>
                                                    Mme Salma Rezgu
                                                </Typography>
                                            </ListItem>
                                            <ListItem disablePadding sx={{py: .7}}>
                                                <Typography width={140} minWidth={140} variant="body2"
                                                            color='text.secondary'>
                                                    {t("cin")}
                                                </Typography>
                                                <Typography fontWeight={500}>
                                                    02165102
                                                </Typography>
                                            </ListItem>
                                            <ListItem disablePadding sx={{py: .7}}>
                                                <Typography width={140} minWidth={140} variant="body2"
                                                            color='text.secondary'>
                                                    {t("birthdate")}
                                                </Typography>
                                                <Typography fontWeight={500}>
                                                    29 juin 1972
                                                </Typography>
                                            </ListItem>
                                            <ListItem disablePadding sx={{py: .7, alignItems: 'flex-start'}}>
                                                <Typography width={140} minWidth={140} variant="body2"
                                                            color='text.secondary'>
                                                    {t("mobile")}
                                                </Typography>
                                                <Stack spacing={1.25}>
                                                    <Stack direction='row' alignItems='center' spacing={1}>
                                                        <Avatar
                                                            sx={{
                                                                width: 27,
                                                                height: 18,
                                                                borderRadius: 0
                                                            }}
                                                            alt={"flags"}
                                                            src={`https://flagcdn.com/tn.svg`}
                                                        />
                                                        <Typography fontWeight={500}>
                                                            +216 22 469 495
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction='row' alignItems='center' spacing={1}>
                                                        <Avatar
                                                            sx={{
                                                                width: 27,
                                                                height: 18,
                                                                borderRadius: 0
                                                            }}
                                                            alt={"flags"}
                                                            src={`https://flagcdn.com/tn.svg`}
                                                        />
                                                        <Typography fontWeight={500}>
                                                            +216 22 469 495
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </ListItem>
                                            <ListItem disablePadding sx={{py: .7}}>
                                                <Typography width={140} minWidth={140} variant="body2"
                                                            color='text.secondary'>
                                                    {t("email")}
                                                </Typography>
                                                <Typography fontWeight={500}>
                                                    almerezgui@med.com
                                                </Typography>
                                            </ListItem>
                                            <ListItem disablePadding sx={{py: .7}}>
                                                <Typography width={140} minWidth={140} variant="body2"
                                                            color='text.secondary'>
                                                    {t("address")}
                                                </Typography>
                                                <Typography fontWeight={500}>
                                                    10 Avenue Habib Bourguiba,Tunis 1000 , Tunisia
                                                </Typography>
                                            </ListItem>
                                        </List>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Stack width={1} mb={1} direction='row' alignItems='center'
                                           justifyContent='space-between'>
                                        <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                            {t("employment_details")}
                                        </Typography>
                                        <IconButton onClick={() => setOpenEmploymentDetails(true)} size="small"
                                                    sx={{border: 1, borderColor: "divider", borderRadius: 1}}>
                                            <IconUrl width={20} height={20} path="ic-edit-pen"/>
                                        </IconButton>
                                    </Stack>
                                    <List disablePadding>
                                        <ListItem disablePadding sx={{py: .7}}>
                                            <Typography width={140} minWidth={140} variant="body2"
                                                        color='text.secondary'>
                                                {t("start_date")}
                                            </Typography>
                                            <Typography fontWeight={500}>
                                                12/06/2023
                                            </Typography>
                                        </ListItem>
                                        <ListItem disablePadding sx={{py: .7}}>
                                            <Typography width={140} minWidth={140} variant="body2"
                                                        color='text.secondary'>
                                                {t("end_date")}
                                            </Typography>
                                            <Typography fontWeight={500}>
                                                12/06/2024
                                            </Typography>
                                        </ListItem>
                                    </List>
                                    <Stack mt={3} alignItems='flex-start'>
                                        <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                            {t("role")}
                                        </Typography>
                                        <Stack spacing={2} alignItems='flex-start'>
                                            <Button variant="contained" color="info" sx={{fontWeight: 600}}>
                                                Secretary
                                            </Button>
                                            <Typography variant="subtitle1"
                                                        fontWeight={600}>{t("reset_pass")}</Typography>
                                            <Button variant="google"
                                                    sx={{border: 'none', bgcolor: theme => theme.palette.grey["A500"]}}
                                            >
                                                {t("reset_pass")}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Stack spacing={2}>
                            <Card>
                                <CardContent>
                                    <Stack spacing={1} alignItems='flex-start'>
                                        <Typography variant="subtitle1" fontWeight={600}>{t("department")}</Typography>
                                        <Button variant="contained" color="info" sx={{fontWeight: 600}}>
                                            Gynecology
                                        </Button>
                                    </Stack>
                                    <Stack mt={3} spacing={1} alignItems='flex-start'>
                                        <Typography variant="subtitle1" fontWeight={600}>{t("work_for")}</Typography>
                                        <List disablePadding>
                                            {Array.from({length: 2}).map((_, idx) =>

                                                <ListItem key={idx} sx={{px: 0, py: .5}}
                                                >
                                                    <ListItemIcon>
                                                        <Avatar
                                                            src={"/static/icons/men-avatar.svg"}
                                                            sx={{
                                                                width: 45,
                                                                height: 45,
                                                                borderRadius: 2

                                                            }}>
                                                            <IconUrl width={45} height={45} path="men-avatar"/>
                                                        </Avatar>
                                                    </ListItemIcon>
                                                    <Stack spacing={.2}>
                                                        <Typography fontSize={13} fontWeight={600} color='primary'>
                                                            Dr Ghassen BOULAHIA
                                                        </Typography>
                                                        <Typography variant='body2' fontWeight={600}>
                                                            Gynécologue Obstétricien
                                                        </Typography>
                                                    </Stack>
                                                </ListItem>
                                            )}


                                        </List>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Stack width={1} mb={1} direction='row' alignItems='center'
                                           justifyContent='space-between'>
                                        <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                            {t("scheduled_shifts")}
                                        </Typography>
                                        <IconButton onClick={() => setOpenScheduledShifts(true)} size="small"
                                                    sx={{border: 1, borderColor: "divider", borderRadius: 1}}>
                                            <IconUrl width={20} height={20} path="ic-edit-pen"/>
                                        </IconButton>
                                    </Stack>

                                    <List>
                                        {
                                            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, idx) =>
                                                <ListItem disablePadding key={idx}

                                                          sx={{py: .5}}
                                                >
                                                    <ListItemText sx={{m: 0, span: {fontWeight: 600}}} primary={day}/>
                                                    <Label variant="filled" sx={{
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        bgcolor: (theme: any) => theme.palette.background.default,
                                                        borderRadius: 1,
                                                        px: 1.5,
                                                        py: 1,
                                                        height: 37
                                                    }}>
                                                        10:00 AM - 01:00 PM
                                                    </Label>
                                                </ListItem>
                                            )
                                        }


                                    </List>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Stack spacing={2}>
                            <Card>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {t("working_hours")}
                                        </Typography>
                                        <Button disableRipple sx={{
                                            justifyContent: 'space-between',
                                            bgcolor: theme => theme.palette.info.main,
                                            fontWeight: 600,
                                            color: 'primary.main'
                                        }} variant="contained-white" startIcon={
                                            <ChevronLeftIcon/>

                                        } endIcon={<ChevronRightIcon/>}>
                                            12 - 18 Feb 2024
                                        </Button>
                                        <ChartStyled>
                                            <Chart
                                                type='bar'

                                                series={
                                                    [
                                                        {
                                                            name: 'PRODUCT A',
                                                            data: [44, 55, 41, 67, 22, 43, 16]
                                                        }, {
                                                        name: 'PRODUCT B',
                                                        data: [13, 23, 20, 8, 13, 27, 14]
                                                    }, {
                                                        name: 'PRODUCT C',
                                                        data: [11, 17, 15, 15, 21, 14, 12]
                                                    }
                                                    ]
                                                }
                                                options={merge(ChartsOption(), {
                                                    chart: {
                                                        type: 'bar',
                                                        stacked: true,

                                                    },
                                                    plotOptions: {
                                                        bar: {
                                                            horizontal: false,
                                                            borderRadius: 3,
                                                            columnWidth: '30%',
                                                        },
                                                    },
                                                    xaxis: {
                                                        type: 'day',
                                                        categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'
                                                        ],
                                                    },

                                                    fill: {
                                                        opacity: 1
                                                    },
                                                    legend: {
                                                        show: false
                                                    }

                                                }) as any}
                                                height={240}
                                            />
                                        </ChartStyled>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {t("recent_activities")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        890,344 {t("activities")}
                                    </Typography>
                                    <Timeline

                                        sx={{
                                            p: 0,
                                            [`& .${timelineOppositeContentClasses.root}`]: {
                                                flex: 0.2,
                                            },
                                        }}
                                    >
                                        <TimelineItem>
                                            <TimelineOppositeContent
                                                sx={{fontWeight: 600, pl: 0, pr: .5, textAlign: 'left'}}>
                                                09:30
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color="success"/>
                                                <TimelineConnector/>
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" color="textSecondary">
                                                    <Link underline="none">
                                                        Dr.Henry Markhay
                                                    </Link>
                                                    {" "} Completed the Patient visit with {" "}
                                                    <Link underline="none">Walid Tanazefti</Link>
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineOppositeContent
                                                sx={{fontWeight: 600, pl: 0, pr: .5, textAlign: 'left'}}>
                                                09:30
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color="secondary"/>
                                                <TimelineConnector/>
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Stack spacing={1}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Bernardo James Uploaded 2 new documents to Mohamed belagha file
                                                    </Typography>
                                                </Stack>
                                                <List disablePadding>


                                                    <ListItem sx={{px: 0, py: .5}}
                                                    >
                                                        <ListItemIcon sx={{minWidth: 40}}>
                                                            <IconUrl width={30} height={30} path="pdf"/>
                                                        </ListItemIcon>
                                                        <Stack spacing={.1}>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                Airplus Guideline
                                                            </Typography>
                                                            <Typography variant='caption' color='textSecondary'>
                                                                12 mb
                                                            </Typography>
                                                        </Stack>
                                                    </ListItem>

                                                    <ListItem sx={{px: 0, py: .5}}
                                                    >
                                                        <ListItemIcon sx={{minWidth: 40}}>
                                                            <IconUrl width={30} height={30} path="ic-doc-file"/>
                                                        </ListItemIcon>
                                                        <Stack spacing={.1}>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                FureStibe requirements
                                                            </Typography>
                                                            <Typography variant='caption' color='textSecondary'>
                                                                8 kb
                                                            </Typography>
                                                        </Stack>
                                                    </ListItem>

                                                </List>
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineOppositeContent
                                                sx={{fontWeight: 600, pl: 0, pr: .5, textAlign: 'left'}}>
                                                14:30
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color="error"/>
                                                <TimelineConnector/>
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" fontWeight={600} fontSize={13}>
                                                    Make deposit
                                                    <Link underline="none" color="success.main">
                                                        {" "} USD 700 {" "}
                                                    </Link>
                                                    to ESL
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineOppositeContent
                                                sx={{fontWeight: 600, pl: 0, pr: .5, textAlign: 'left'}}>
                                                21:30
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" color="error"/>
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" fontWeight={600} fontSize={13}>
                                                    New order placed {" "}
                                                    <Link underline="none" color="success.main">
                                                        #XF-2356
                                                    </Link>
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                    </Timeline>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            <Dialog
                title={t("personal_info")}
                action="personal-info"
                open={openPersonalInfo}
                data={{t, handleClose: handleClosePersonalInfo}}
                dialogClose={handleClosePersonalInfo}
                onClose={handleClosePersonalInfo}
            />
            <Dialog
                title={t("employment_details")}
                action="employment-details"
                size="sm"
                open={openEmploymentDetails}
                data={{t, handleClose: handleCloseEmploymentDetails}}
                dialogClose={handleCloseEmploymentDetails}
                onClose={handleCloseEmploymentDetails}
                actionDialog={
                    <>
                        <Button onClick={handleCloseEmploymentDetails} sx={{mr: 'auto'}} variant="text-black">
                            {t("dialog.cancel")}
                        </Button>
                        <Button variant="contained">
                            {t("dialog.save")}
                        </Button>
                    </>
                }
            />
            <Dialog
                title={t("scheduled_shifts")}
                action="scheduled-shifts"
                size="sm"
                open={openScheduledShifts}
                data={{t, handleClose: handleCloseScheduledShifts}}
                dialogClose={handleCloseScheduledShifts}
                onClose={handleCloseScheduledShifts}
                actionDialog={
                    <>
                        <Button onClick={handleCloseScheduledShifts} sx={{mr: 'auto'}} variant="text-black">
                            {t("dialog.cancel")}
                        </Button>
                        <Button variant="contained">
                            {t("dialog.save")}
                        </Button>
                    </>
                }
            />
            <Dialog
                title={t("dialog.assignment")}
                action="assignment"
                size="sm"
                open={openAssignment}
                data={{t, handleClose: handleCloseAssignment}}
                dialogClose={handleCloseAssignment}
                onClose={handleCloseAssignment}
                actionDialog={
                    <>
                        <Button onClick={handleCloseAssignment} sx={{mr: 'auto'}} variant="text-black">
                            {t("dialog.cancel")}
                        </Button>
                        <Button variant="contained">
                            {t("dialog.save")}
                        </Button>
                    </>
                }
            />
        </>
    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'staff']))
    }
})

export default StaffDetails;

StaffDetails.auth = true;

StaffDetails.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
}
