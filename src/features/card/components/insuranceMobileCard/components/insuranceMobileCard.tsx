import React from 'react'
import CardStyled from './overrides/cardStyle';
import { Avatar, Button, CardContent, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { ImageHandler } from '@features/image';
import IconUrl from '@themes/urlIcon';

function InsuranceMobileCard({ ...props }) {
    const { row, handleEvent, t } = props;
    return (
        <CardStyled>
            <CardContent>
                <Stack spacing={1}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        {row ? (
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <Tooltip

                                    title={row.name}>
                                    <Avatar variant={"circular"} sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: 'transparent', borderColor: 'common.white' }}>
                                        <ImageHandler
                                            alt={row.name}
                                            src={row.url}
                                        />
                                    </Avatar>
                                </Tooltip>
                                <Typography fontWeight={600}>
                                    {row.name}
                                </Typography>
                            </Stack>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                        <IconButton disableRipple size="small" onClick={(e) => handleEvent({ event: e, data: row, action: "OPEN-POPOVER" })}>
                            <IconUrl path="ic-autre" />
                        </IconButton>

                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Stack>
                            <Typography variant='caption'>
                                {t("table.label")}
                            </Typography>
                            {row ? (
                                <Typography fontSize={13} fontWeight={600}>
                                    Label
                                </Typography>
                            ) : (
                                <Skeleton variant="text" width={100} />
                            )}
                        </Stack>
                        <Stack>
                            <Typography variant='caption'>
                                {t("table.start_date")}
                            </Typography>
                            {row ? (
                                <Stack direction='row' alignItems='center' spacing={1}>
                                    <IconUrl path="ic-agenda-jour" />
                                    <Typography fontSize={13} fontWeight={600}>
                                        10/10/2022
                                    </Typography>
                                </Stack>
                            ) : (
                                <Skeleton variant="text" width={100} />
                            )}
                        </Stack>
                        <Stack>
                            <Typography variant='caption'>
                                {t("table.end_date")}
                            </Typography>
                            {row ? (
                                <Stack direction='row' alignItems='center' spacing={1}>
                                    <IconUrl path="ic-agenda-jour" />
                                    <Typography fontSize={13} fontWeight={600}>
                                        10/10/2022
                                    </Typography>
                                </Stack>
                            ) : (
                                <Skeleton variant="text" width={100} />
                            )}
                        </Stack>
                    </Stack>
                    <Button
                        sx={{
                            bgcolor: theme => theme.palette.grey["A500"],
                            border: 'none',
                            alignSelf: { xs: "stretch", sm: "flex-start" }
                        }}
                        endIcon={
                            <Typography component='span' style={{ fontSize: 10 }}>
                                9
                            </Typography>

                        }
                        variant="google">
                        <Typography fontSize={14} component={'span'}>
                            Ajouter un acte
                        </Typography>
                    </Button>
                </Stack>
            </CardContent>
        </CardStyled>
    )
}

export default InsuranceMobileCard