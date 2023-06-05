import {Stack, Typography, useMediaQuery, Button} from '@mui/material'
import {useRouter} from 'next/router';
import {useTranslation} from "next-i18next";
import {DrawerBottom} from '@features/drawerBottom';
import {WaitingRoom} from '@features/leftActionBar'
import Icon from '@themes/urlIcon'
import React, {useState} from 'react';
import SalleIcon from "@themes/overrides/icons/salleIcon";
import {useSnackbar} from "notistack";
import {LoadingScreen} from "@features/loadingScreen";

function RoomToolbar({...props}) {
    const {board, data, handleCollapse, openCalendar} = props;
    const [open, set0pen] = useState(false);
    const router = useRouter();
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation('waitingRoom', {keyPrefix: 'subheader'});
    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <Stack direction='row' justifyContent="space-between" mt={2.8} width={1} alignItems="center">
            <Typography>
                {t('title')}
            </Typography>
            <Stack direction='row' alignItems="center" spacing={1}>
                {(isMobile && board) && (
                    <React.Fragment>
                        {
                            data?.map((item: any) => (
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
                                    }} variant='contained' color={item.color} key={Math.random()}>
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
                    display: {xs: 'flex', md: 'none'}
                }}
            >
                Filtrer (0)
            </Button>
            <DrawerBottom
                handleClose={() => set0pen(false)}
                open={open}
                title="Filter"
            >
                <WaitingRoom/>
            </DrawerBottom>
        </Stack>
    )
}

export default RoomToolbar
