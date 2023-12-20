import {Stack, useMediaQuery, Button, Tabs, Tab, Badge, Avatar} from '@mui/material'
import {DrawerBottom} from '@features/drawerBottom';
import {WaitingRoom} from '@features/leftActionBar'
import Icon from '@themes/urlIcon'
import React, {SyntheticEvent, useCallback, useState} from 'react';
import {MobileContainer} from '@themes/mobileContainer';
import {a11yProps} from "@lib/hooks";
import {MinMaxWindowButton, minMaxWindowSelector} from '@features/buttons';
import {LoadingButton} from "@mui/lab";
import IconUrl from "@themes/urlIcon";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {CipCard} from "@features/card";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {onOpenPatientDrawer} from "@features/table";

function RoomToolbar({...props}) {
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
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const dispatch = useAppDispatch();

    const {isWindowMax} = useAppSelector(minMaxWindowSelector);

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

    const handleStepperIndexChange = useCallback((event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }, [setTabIndex]);

    return (
        <Stack
            sx={{
                ".tabs-bg-white.tabs-bg-white": {
                    borderTopWidth: 0,
                }
            }} direction='row' justifyContent="space-between" mt={2.8} width={1} alignItems="center">
            <Tabs
                value={tabIndex}
                onChange={handleStepperIndexChange}
                variant="scrollable"
                aria-label="basic tabs example"
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
            <Stack direction='row' alignItems="center" spacing={1}>
                {isMobile && (
                    <React.Fragment>
                        {data?.map((item: any, index: number) => (
                            <Button
                                {...(handleCollapse && {onClick: () => handleCollapse(item.id)})}
                                sx={{
                                    minWidth: 40,
                                    textTransform: 'capitalize',
                                    color: theme => theme.palette.text.primary,
                                    '& svg': {
                                        width: 14,
                                        height: 14,
                                        '& path': {fill: theme => theme.palette.text.primary}
                                    }
                                }} variant='contained' color={item.color} key={index.toString()}>
                                <Icon path={item.icon}/>
                            </Button>
                        ))
                        }
                    </React.Fragment>
                )}
            </Stack>
            <MobileContainer>
                <Button
                    startIcon={<Icon path="ic-filter"/>}
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
                <WaitingRoom/>
            </DrawerBottom>

            <Stack direction={"row"} alignItems={"center"} mb={.5}>
                {(is_next && isWindowMax) &&
                    <LoadingButton
                        disableRipple
                        color={"black"}
                        onClick={() => {
                            dispatch(onOpenPatientDrawer({patientId: is_next.patient_uuid}));
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
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                            badgeContent={
                                <Avatar alt="Small avatar" sx={{
                                    pt: .2,
                                    width: 16,
                                    height: 16,
                                    borderRadius: 20,
                                    border: theme => `2px solid ${theme.palette.background.paper}`
                                }}>
                                    <IconUrl width={14} height={16} path={"ic-next"}/>
                                </Avatar>
                            }>
                            <Avatar
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 20,
                                    border: theme => `2px solid ${theme.palette.background.paper}`
                                }} variant={"circular"}
                                src={`/static/icons/men-avatar.svg`}/>
                        </Badge>}
                        variant={"contained"}>
                        <Stack direction={"row"} alignItems={"center"}>
                            {is_next.patient}
                            <Avatar
                                alt="Small avatar"
                                variant={"square"}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    nextConsultation({is_next: true, uuid: is_next.uuid});
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
                                    }}/>
                            </Avatar>
                        </Stack>
                    </LoadingButton>
                }

                {(isActive && isWindowMax) &&
                    <CipCard
                        openPatientDialog={(uuid: string) => {
                            dispatch(onOpenPatientDrawer({patientId: uuid}));
                            setPatientDetailDrawer(true);
                        }}/>
                }
                <MinMaxWindowButton/>
            </Stack>

        </Stack>
    )
}

export default RoomToolbar
