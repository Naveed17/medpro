import React from 'react'
import CardStyled from './overrides/cardStyle'
import { CardContent, IconButton, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import IconUrl from '@themes/urlIcon';
import Can from "@features/casl/can";
function DrugMobileCard({ ...props }) {
    const { row, t, handleEvent } = props;
    const theme = useTheme();
    return (
        <CardStyled>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        {row ? (
                            row.commercial_name ?
                                (
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {row.commercial_name}
                                    </Typography>
                                )
                                : (
                                    <Typography>--</Typography>
                                )

                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                        {row ? (
                            <Stack direction='row' alignItems='center' justifyContent='flex-end'>
                                <Can I={"manage"} a={"settings"} field={"settings__drugs__update"}>
                                    <IconButton
                                        size="small"
                                        sx={{ mr: { md: 1 } }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEvent({ action: "EDIT_DRUGS", row, e });
                                        }}>
                                        <IconUrl color={theme.palette.primary.main} path="ic-edit-patient" />
                                    </IconButton>
                                </Can>
                                <Can I={"manage"} a={"settings"} field={"settings__drugs__delete"}>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            mr: { md: 1 },
                                            '& .react-svg svg': {
                                                width: 20,
                                                height: 20
                                            }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEvent({ action: "DELETE_DRUGS", row, e });
                                        }}>
                                        <IconUrl color={theme.palette.error.main} path="ic-trash" />
                                    </IconButton>
                                </Can>
                            </Stack>
                        ) : (
                            <Skeleton width={30} height={40} sx={{ m: "auto" }} />
                        )}
                    </Stack>
                    <Stack className='row'>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Typography variant='body2' color="textSecondary"
                                fontWeight={500}>{t("table.dci")} :</Typography>
                            {row ? (
                                !row.dci ? (
                                    <Typography>--</Typography>
                                ) : (

                                    <Typography>{row.dci?.name}</Typography>

                                )
                            ) : (
                                <Skeleton width={30} height={40} sx={{ mx: "auto" }} />
                            )}
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Typography variant='body2' color="textSecondary"
                                fontWeight={500}>{t("table.form")} :</Typography>
                            {row ? (
                                !row.form ? (
                                    <Typography>--</Typography>
                                ) : (

                                    <Typography>{row.form?.name}</Typography>

                                )
                            ) : (
                                <Skeleton width={30} height={40} sx={{ mx: "auto" }} />
                            )}
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Typography variant='body2' color="textSecondary"
                                fontWeight={500}>{t("table.laboratory")} :</Typography>
                            {row ? (
                                !row.laboratory ? (
                                    <Typography>--</Typography>
                                ) : (

                                    <Typography>{row.laboratory?.name}</Typography>

                                )
                            ) : (
                                <Skeleton width={30} height={40} sx={{ mx: "auto" }} />
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </CardStyled>
    )
}

export default DrugMobileCard