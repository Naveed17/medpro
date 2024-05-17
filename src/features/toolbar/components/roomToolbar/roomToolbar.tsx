import { Stack, useMediaQuery, Button, Tabs, Tab, Badge, Avatar, useTheme, Typography } from '@mui/material'
import { DrawerBottom } from '@features/drawerBottom';
import { WaitingRoom } from '@features/leftActionBar'
import Icon from '@themes/urlIcon'
import React, { SyntheticEvent, useCallback, useState } from 'react';
import { MobileContainer } from '@themes/mobileContainer';
import { MobileContainer as SmContainer } from '@lib/constants';
import { a11yProps } from "@lib/hooks";
import { CustomIconButton, MinMaxWindowButton, minMaxWindowSelector } from '@features/buttons';
import { LoadingButton } from "@mui/lab";
import IconUrl from "@themes/urlIcon";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { CipCard } from "@features/card";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { onOpenPatientDrawer } from "@features/table";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { agendaSelector, setNavigatorMode } from "@features/calendar";
import { ToggleButtonStyled } from "@features/toolbar";
import { Breadcrumbs } from '@features/breadcrumbs';
import moment from "moment-timezone";
const breadcrumbsData = [
    {
        title: "Queue Management",
        href: "/dashboard/waiting-room"
    },
    {
        title: "Overview"
    }
]
function RoomToolbar({ ...props }) {
    const {
        t,
        tabIndex,
        setTabIndex,
        setPatientDetailDrawer,
        nextConsultation,
        columns,
        data,
        handleCollapse,
        is_next,
        isActive
    } = props;
    const isMobile = useMediaQuery(`(max-width:${SmContainer}px)`);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { data: session } = useSession();

    const { isWindowMax } = useAppSelector(minMaxWindowSelector);
    const { mode } = useAppSelector(agendaSelector);

    const { data: user } = session as Session;
    const roles = (user as UserDataResponse).general_information.roles as Array<string>;

    const [open, set0pen] = useState(false);
    const [tabsContent] = useState([
        {
            title: "overview",
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        },
        ...columns.map((column: any) => ({
            title: column.name,
            permission: ["ROLE_SECRETARY", "ROLE_PROFESSIONAL"]
        }))
    ]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePreviousDate = () => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    };

    const handleNextDate = () => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    };
    const handleStepperIndexChange = useCallback((event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }, [setTabIndex]);

    return (


        <Stack
            sx={{
                ".tabs-bg-white.tabs-bg-white": {
                    borderTopWidth: 0,
                }
            }} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" mt={1} mb={isMobile ? 0 : 1} width={1} alignItems={{ xs: 'flex-start', sm: 'row' }}>
            <Stack spacing={1}>
                <Breadcrumbs data={[...breadcrumbsData]} />
                <Typography variant='subtitle1'>{t("subheader.title")}</Typography>
                {isMobile && (
                    <Tabs
                        value={tabIndex}
                        onChange={handleStepperIndexChange}
                        variant="scrollable"
                        aria-label="basic tabs example"
                        sx={{ "&.MuiTabs-root": { mt: { xs: 6.25, sm: 0 } } }}
                        className="tabs-bg-white">
                        {tabsContent.map((tabHeader, tabHeaderIndex) => (
                            <Tab
                                key={`tabHeader-${tabHeaderIndex}`}
                                disableRipple
                                label={t(`tabs.${tabHeader.title}`)}

                                {...a11yProps(tabHeaderIndex)}
                                {...(isMobile && {
                                    sx: {
                                        display: tabHeader.title === 'overview' ? 'none' : 'inline-flex'
                                    }
                                })}
                            />)
                        )}
                    </Tabs>
                )}
            </Stack>
            <Stack direction='row' alignItems="center" spacing={1}>
                {isMobile && (
                    <React.Fragment>
                        {data?.map((item: any, index: number) => (
                            <Button
                                {...(handleCollapse && { onClick: () => handleCollapse(item.id) })}
                                sx={{
                                    minWidth: 40,
                                    textTransform: 'capitalize',
                                    color: theme => theme.palette.text.primary,
                                    '& svg': {
                                        width: 14,
                                        height: 14,
                                        '& path': { fill: theme => theme.palette.text.primary }
                                    }
                                }} variant='contained' color={item.color} key={index.toString()}>
                                <Icon path={item.icon} />
                            </Button>
                        ))
                        }
                    </React.Fragment>
                )}
            </Stack>
            <MobileContainer>
                <Button
                    startIcon={<Icon path="ic-filter" />}
                    variant="filter"
                    onClick={() => set0pen(!open)}
                    sx={{
                        position: 'fixed',
                        bottom: 50,
                        transform: 'translateX(-50%)',
                        left: '50%',
                        zIndex: 999,

                    }}>
                    Filtrer (0)
                </Button>
            </MobileContainer>
            <DrawerBottom
                handleClose={() => set0pen(false)}
                open={open}
                title="Filter">
                <WaitingRoom />
            </DrawerBottom>

            <Stack sx={{
                position: { xs: 'absolute', sm: 'static' }, bottom: { xs: 50, sm: 0 }, [theme.breakpoints.between("sm", "md")]: {
                    position: 'absolute',
                    right: 16,
                    top: -36
                }
            }} direction={"row"} alignItems={"center"} spacing={1}>
                {(is_next && isWindowMax) &&
                    <LoadingButton
                        disableRipple
                        color={"black"}
                        onClick={() => {
                            dispatch(onOpenPatientDrawer({ patientId: is_next.patient_uuid }));
                            setPatientDetailDrawer(true);
                        }}
                        sx={{
                            scale: "0.96",
                            mr: isActive ? 0 : 1,
                            p: "6px 12px",
                            backgroundColor: (theme) => theme.palette.info.lighter,
                            '&:hover': {
                                backgroundColor: (theme) => theme.palette.info.lighter,
                            }
                        }}
                        loadingPosition={"start"}
                        startIcon={<Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <Avatar alt="Small avatar" sx={{
                                    pt: .2,
                                    width: 16,
                                    height: 16,
                                    borderRadius: 20,
                                    border: theme => `2px solid ${theme.palette.background.paper}`
                                }}>
                                    <IconUrl width={14} height={16} path={"ic-next"} />
                                </Avatar>
                            }>
                            <Avatar
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 20,
                                    border: theme => `2px solid ${theme.palette.background.paper}`
                                }} variant={"circular"}
                                src={`/static/icons/men-avatar.svg`} />
                        </Badge>}
                        variant={"contained"}>
                        <Stack direction={"row"} alignItems={"center"}>
                            {is_next.patient}
                            <Avatar
                                alt="Small avatar"
                                variant={"square"}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    nextConsultation({ is_next: true, uuid: is_next.uuid });
                                }}
                                sx={{
                                    ml: 1,
                                    background: "#FFF",
                                    width: 30,
                                    height: 30,
                                    border: theme => `1px solid ${theme.palette.grey["A900"]}`
                                }}>
                                <CloseRoundedIcon
                                    sx={{
                                        color: theme => theme.palette.text.primary,
                                        width: 20,
                                        height: 20
                                    }} />
                            </Avatar>
                        </Stack>
                    </LoadingButton>
                }

                {(isActive && isWindowMax) &&
                    <CipCard
                        openPatientDialog={(uuid: string) => {
                            dispatch(onOpenPatientDrawer({ patientId: uuid }));
                            setPatientDetailDrawer(true);
                        }} />
                }
                {roles.includes('ROLE_SECRETARY') && <MinMaxWindowButton />}


                <Stack p={1.275} maxHeight={40} px={2} bgcolor={theme.palette.grey[50]} borderRadius={1} direction={"row"} alignItems={"center"} spacing={2}>
                    <CustomIconButton
                        onClick={handlePreviousDate}
                        style={{ minWidth: 16, minHeight: 16, padding: 0, borderRadius: 6, backgroundColor: theme.palette.grey[700] }}>
                        <IconUrl width={9} height={9} color="white" path={"ic-outline-arrow-left"} />
                    </CustomIconButton>
                    <Typography fontWeight={500} color="text.secondary">{moment(currentDate).format('DD-MMMM-YYYY')}</Typography>
                    <CustomIconButton
                        onClick={handleNextDate}
                        style={{ minWidth: 16, minHeight: 16, padding: 0, borderRadius: 6, backgroundColor: theme.palette.grey[700] }}>
                        <IconUrl width={9} height={9} color="white" path={"ic-outline-arrow-right"} />
                    </CustomIconButton>
                </Stack>
                <CustomIconButton sx={{ bgcolor: theme.palette.grey[100], border: 1, borderColor: theme.palette.grey[300] }}>
                    <IconUrl width={16} height={16} path={"ic-filled-chart-square"} />
                </CustomIconButton>
                <ToggleButtonStyled
                    id="toggle-button"
                    value="toggle"
                    onClick={() => dispatch(setNavigatorMode(mode === "normal" ? "discreet" : "normal"))}
                    className={"toggle-button"}
                    sx={{
                        ...(mode !== "normal" && { border: "none" }),
                        background: mode !== "normal" ? theme.palette.primary.main : theme.palette.grey['A500'],
                        minWidth: 40,
                        minHeight: 40,
                    }}>
                    <IconUrl width={19} height={19}
                        path={"ic-eye-slash"} {...(mode !== "normal" && { color: "white" })} />
                </ToggleButtonStyled>
                <CustomIconButton color="primary">
                    <IconUrl width={16} height={16} path={"ic-plus"} color="white" />
                </CustomIconButton>
            </Stack>
        </Stack >

    )
}

export default RoomToolbar
