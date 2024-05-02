import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, timelineItemClasses } from '@mui/lab'
import React, { useState } from 'react'
import CardStyled from './overrides/nextRdvCardStyle'
import { IconButton, MenuItem, Stack, Theme, Typography, useTheme } from '@mui/material'
import { CustomIconButton } from '@features/buttons'
import IconUrl from '@themes/urlIcon'
import { Label } from '@features/label'
import { ActionMenu } from "@features/menu";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
function NextRdvCard() {
    const theme = useTheme();
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const handleCloseMenu = () => {
        setContextMenu(null);
    }

    const OnMenuActions = (action: string) => {
        handleCloseMenu();
        switch (action) {
            case "onDelete":

                break;
            case "onRetry":

                break;
        }
    }
    return (
        <>
            <CardStyled
                sx={{
                    px: 0,
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineDot variant='outlined' color='primary' />
                        {/* <TimelineConnector /> */}
                    </TimelineSeparator>
                    <TimelineContent>
                        <Stack justifyContent="space-between" direction='row' alignItems='center' >
                            <Stack direction='row' spacing={2} alignItems="flex-start">
                                <CustomIconButton sx={{ bgcolor: (theme: Theme) => theme.palette.primary.lighter }}>
                                    <IconUrl path="ic-agenda-jour" width={21} height={21} color={theme.palette.primary.main} />
                                </CustomIconButton>
                                <Stack spacing={.3}>
                                    <Typography color="primary" fontWeight={600} variant='subtitle2'>Appointment</Typography>
                                    <Stack direction='row' alignItems='center' spacing={1}>
                                        <IconUrl path="ic-agenda-jour" width={16} height={16} />
                                        <Typography fontWeight={500}>DD/MM/YYYY</Typography>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' spacing={1}>
                                        <IconUrl path="ic-time" width={16} height={16} />
                                        <Typography fontWeight={500}>00:00:00</Typography>
                                        <Label color='success' sx={{ color: theme.palette["success"].main, fontWeight: 500, fontSize: 12 }}>
                                            Confirmed
                                        </Label>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' spacing={1}>
                                        <IconUrl path="ic-outline-user-circle" width={16} height={16} />
                                        <Typography color="text.secondary" variant='caption' fontWeight={500}>By name</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <IconButton

                                onClick={event => {
                                    event.stopPropagation();
                                    setContextMenu(
                                        contextMenu === null
                                            ? {
                                                mouseX: event.clientX + 2,
                                                mouseY: event.clientY - 6,
                                            } : null,
                                    );
                                }}
                                disableRipple sx={{ p: 0 }}>
                                <IconUrl path="ic-Filled-more-vertical" />
                            </IconButton>
                        </Stack>
                    </TimelineContent>
                </TimelineItem>
            </CardStyled>
            <ActionMenu {...{ contextMenu, handleClose: handleCloseMenu }}>
                {[
                    {
                        title: "delete-document",
                        icon: <DeleteOutlineRoundedIcon />,
                        action: "onDelete",
                    },
                ].map(
                    (v: any, index) => (
                        <MenuItem
                            key={index}
                            className="popover-item"
                            onClick={() => {
                                OnMenuActions(v.action);
                            }}>
                            {v.icon}
                            <Typography fontSize={15} sx={{ color: "#fff" }}>
                                {v.title}
                            </Typography>
                        </MenuItem>
                    )
                )}
            </ActionMenu>
        </>
    )
}

export default NextRdvCard