import {Stack, Typography, useMediaQuery, Button, Tabs, Tab} from '@mui/material'
import {useRouter} from 'next/router';
import {useTranslation} from "next-i18next";
import {DrawerBottom} from '@features/drawerBottom';
import {WaitingRoom} from '@features/leftActionBar'
import Icon from '@themes/urlIcon'
import React, {SyntheticEvent, useCallback, useState} from 'react';
import SalleIcon from "@themes/overrides/icons/salleIcon";
import {useSnackbar} from "notistack";
import dynamic from "next/dynamic";
import {MobileContainer} from '@themes/mobileContainer';
import {a11yProps} from "@lib/hooks";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));


function RoomToolbar({...props}) {
    const {tabIndex, setTabIndex, columns, data, handleCollapse, openCalendar} = props;
    const router = useRouter();
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation('waitingRoom', {keyPrefix: 'tabs'});

    const [open, set0pen] = useState(false);

    const [tabsContent, setTabsContent] = useState([
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

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <Stack direction='row' justifyContent="space-between" mt={2.8} width={1} alignItems="center">
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
                        label={t(tabHeader.title)}
                        {...a11yProps(tabHeaderIndex)}
                    />)
                )}
            </Tabs>
            <Stack direction='row' alignItems="center" spacing={1}>
                {isMobile && (
                    <React.Fragment>
                        {
                            data?.map((item: any, index: number) => (
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
                {/*                <Button
                    onClick={() => {
                        router.push('/dashboard/agenda').then(() => {
                            enqueueSnackbar(t("add-to-waiting-room"), {variant: 'info'})
                        });
                    }}
                    startIcon={<SalleIcon/>}
                    variant="contained"
                    color="primary">
                    {t("add")}
                </Button>*/}

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

                    }}
                >
                    Filtrer (0)
                </Button>
            </MobileContainer>
            <DrawerBottom
                handleClose={() => set0pen(false)}
                open={open}
                title="Filter">
                <WaitingRoom/>
            </DrawerBottom>
        </Stack>
    )
}

export default RoomToolbar
