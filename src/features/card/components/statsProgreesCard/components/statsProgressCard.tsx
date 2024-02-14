import { CalendarViewButton } from '@features/buttons'
import { Card, CardContent, IconButton, LinearProgress, LinearProgressProps, Stack, Typography, linearProgressClasses, styled } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import React from 'react'
interface ProgressProps extends LinearProgressProps {
    bgcolor?: string;
}


const BorderLinearProgress = styled(LinearProgress)<ProgressProps>(({ theme, bgcolor }) => ({
    borderRadius: 5,
    height: 6,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: bgcolor

    },
}));
function StatsProgressCard({ ...props }) {
    const { theme, t, view, views, onSelect, data = [], icon, subtitle, total } = props
    return (
        <Card
            sx={{
                borderRadius: "12px",
                height: 1,
                border: "none",
                boxShadow: theme.shadows[5]
            }}>
            <CardContent sx={{ pb: 0 }}>
                <Stack direction={"row"} spacing={1} alignItems={"center"} >
                    <Stack direction={"row"} spacing={1.2} alignItems={"center"} width={1}>
                        <IconUrl path={icon} />
                        <Stack>
                            <Typography fontWeight={600} fontSize={24} variant="caption">
                                {total}
                            </Typography>
                            <Typography fontSize={{ md: 11, xl: 12 }} fontWeight={500} variant="body2">
                                {subtitle}
                            </Typography>
                        </Stack>
                    </Stack>
                    <CalendarViewButton
                        {...{ t }}
                        view={view}
                        sx={{
                            "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                fontSize: 14
                            }
                        }}
                        views={views}
                        onSelect={onSelect}
                    />
                    <IconButton disableRipple>
                        <IconUrl path={"stats/maximize-square"} />
                    </IconButton>
                </Stack>
                <Stack spacing={1} mt={2}>
                    {
                        data.map((item: any, index: number) => (
                            <Stack spacing={.3} key={index}>
                                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                    <Typography variant="body2" fontWeight={500}>{t(item.name)}</Typography>
                                    {item?.time ? (<Typography fontSize={20} fontWeight={600} lineHeight={1.2}>{item?.time} <Typography variant="caption" fontWeight={500}>min</Typography></Typography>) : (<Typography fontSize={20} fontWeight={600} lineHeight={1.2}>{item?.numbers}</Typography>)}

                                </Stack>
                                <BorderLinearProgress bgcolor={item.color} variant="determinate" value={item.value} />
                            </Stack>
                        ))
                    }


                </Stack>
            </CardContent>
        </Card>
    )
}

export default StatsProgressCard