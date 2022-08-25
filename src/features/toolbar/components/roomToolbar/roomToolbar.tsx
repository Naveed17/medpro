import { Box, Stack, Typography, IconButton, useMediaQuery, Button } from '@mui/material'
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";
import { DrawerBottom } from '@features/drawerBottom';
import { WaitingRoom } from '@features/leftActionBar'
import Icon from '@themes/urlIcon'
import React, { useState } from 'react';
type Props = {
    board?: boolean | undefined;
    data?: number[] | any[] | undefined;
    handleCollapse?: (v: number) => void
}
function RoomToolbar({ board, data, handleCollapse }: Props) {
    const [open, setopen] = useState(false);
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const router = useRouter();
    const { t, ready } = useTranslation('waitingRoom', { keyPrefix: 'subheader' });
    if (!ready) return (<>loading translations...</>);
    return (
        <Stack direction='row' justifyContent="space-between" width={1} alignItems="center">
            <Typography>
                {t('title')}
            </Typography>
            <Stack direction='row' alignItems="center" spacing={1}>
                {(isMobile && board) && (
                    <React.Fragment>
                        {
                            data?.map(item => (
                                <Button
                                    {...(handleCollapse && { onClick: () => handleCollapse(item.id) })}
                                    sx={{ minWidth: 40, textTransform: 'capitalize', color: theme => theme.palette.text.primary, '& svg': { width: 14, height: 14, '& path': { fill: theme => theme.palette.text.primary } } }} variant='contained' color={item.color} key={Math.random()}>
                                    <Icon path={item.icon} />
                                </Button>
                            ))
                        }
                    </React.Fragment>
                )

                }
                <IconButton
                    onClick={() => router.push(board ? '/dashboard/waiting-room' : '/dashboard/waiting-room/board')}
                    sx={{
                        transform: "rotate(90deg)"
                        , svg: {
                            width: 20,
                            height: 20,
                        }
                    }}

                    color="inherit"
                >
                    <Icon path="ic-menu" />
                </IconButton>

            </Stack>
            <Button
                startIcon={<Icon path="ic-filter" />}
                variant="filter"
                onClick={() => setopen(!open)}
                sx={{ position: 'fixed', bottom: 50, transform: 'translateX(-50%)', left: '50%', zIndex: 999, display: { xs: 'flex', md: 'none' } }}
            >
                Filtrer (0)
            </Button>
            <DrawerBottom
                handleClose={() => setopen(false)}
                open={open}
                title="Filter"
            >
                <WaitingRoom />
            </DrawerBottom>
        </Stack >
    )
}

export default RoomToolbar