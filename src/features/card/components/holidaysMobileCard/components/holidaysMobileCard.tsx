import React from 'react'
import CardStyled from './overrides/cardStyle';
import { CardContent, IconButton, Stack, Typography,useTheme } from '@mui/material';
import IconUrl from '@themes/urlIcon';

function HolidaysMobileCard({...props}) {
    const {data,t,handleEvent} = props;
    const theme = useTheme();
  return (
    <CardStyled>
        <CardContent>
            <Stack spacing={2}>
            <Stack direction='row' alignItems='center' justifyContent="space-between">
            <Typography fontWeight={600}>
                {data.title}
            </Typography>
            <Stack direction='row' alignItems='center' justifyContent='flex-end'>
                        <IconButton
                            size="small"
                            sx={{mr: {md: 1}}}
                            onClick={() => handleEvent("onEditAbsence", data)}>
                            <IconUrl path="setting/edit"/>
                        </IconButton>
                        {!data.hasData && <IconButton
                            size="small"
                            sx={{mr: {md: 1}}}
                            onClick={() => handleEvent("onDeleteAbsence", data)}>
                            <IconUrl path="setting/icdelete"/>
                        </IconButton>}
                    </Stack>
            </Stack>
            <Stack spacing={.5}>
                <Stack direction='row' alignItems='center' spacing={1}>
                    <Typography minWidth={65} fontSize={11}>{t("table.start")}:</Typography>
                    <Typography className='name' variant="body1"
                                color="text.secondary"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "fit-content",
                                    fontSize: '11px',
                                    lineHeight:0,
                                    svg: {mr: 0.5, ml: 0.5},
                                    borderLeft: `5px solid ${theme.palette.error.main}`,
                                }}
                                component="span">
                        <IconUrl width={12} height={12} path="agenda/ic-agenda2"/>
                        {data.startDate}
                    </Typography>
                </Stack>
                <Stack direction='row' alignItems='center' spacing={1}>
                    <Typography minWidth={65} fontSize={11}>{t("table.end")}:</Typography>
                    <Typography className='name'
                                color="text.secondary"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "fit-content",
                                    fontSize: '11px',
                                    lineHeight:0,
                                    svg: {mr: 0.5, ml: 0.5},
                                    borderLeft: `5px solid ${theme.palette.success.main}`,
                                }}
                                component="span">
                        <IconUrl width={12} height={12} path="agenda/ic-agenda2"/>
                        {data.endDate}
                    </Typography>
                </Stack>

            </Stack>
            </Stack>
        </CardContent>
    </CardStyled>
  )
}

export default HolidaysMobileCard