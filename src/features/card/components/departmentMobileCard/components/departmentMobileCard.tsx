import React from 'react'
import CardStyled from './overrides/cardStyle'
import {Box, CardContent, IconButton, Skeleton, Stack, Typography, useTheme} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import {Label} from "@features/label";

function DepartmentMobileCard({...props}) {
    const {row, t, handleEvent} = props;
    const theme = useTheme();

    return (
        <CardStyled>
            <CardContent>
                <Stack direction='row' alignItems='center'>
                    {row ? (
                        <Typography fontWeight={600} color="text.primary" fontSize={16}>
                            {row.name}
                        </Typography>
                    ) : (
                        <Stack>
                            <Skeleton variant="text" width={100}/>
                        </Stack>
                    )}
                    <Stack direction='row' alignItems='center' spacing={.2} ml={1.5}>
                        <Label
                            className="label"
                            variant="ghost"
                            color={row?.status === 1 ? "success" : "error"}>
                            {t(`config.table.${row?.status === 1 ? "active" : "inactive"}`)}
                        </Label>
                    </Stack>
                    {row ? (
                        <Stack direction='row' alignItems="center" ml="auto" spacing={1}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEvent("EDIT_DEPARTMENT", row)
                                }}
                                color="primary"
                                className="btn-edit">
                                <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                            </IconButton>

                            <IconButton
                                className={"delete-icon"}
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEvent("DELETE_DEPARTMENT", row)
                                }}
                                sx={{
                                    ml: {md: 1},
                                    '& .react-svg svg': {
                                        width: 20,
                                        height: 20
                                    }
                                }}>
                                <IconUrl color={theme.palette.text.secondary} path="ic-trash"/>
                            </IconButton>
                        </Stack>
                    ) : (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="flex-end">
                            <Skeleton variant="text" width={50}/>
                            <Skeleton variant="text" width={50}/>
                        </Stack>
                    )}
                </Stack>
                <Box className="row" mt={2}>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant='body2' color="textSecondary"
                                    fontWeight={500}>{t("config.table.department-head")} :</Typography>
                        {row ? (
                            <>
                                <Typography
                                    textAlign={"center"}
                                    variant="body1"
                                    fontSize={13}
                                    fontWeight={700}
                                    color="text.primary">
                                    {`${row.headOfService?.firstName} ${row.headOfService?.lastName}` ?? "--"}
                                </Typography>
                            </>
                        ) : (
                            <Skeleton variant="text" width={100}/>
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant='body2' color="textSecondary"
                                    fontWeight={500}>{t("config.table.date")} :</Typography>
                        {row ? (
                            <>
                                <Typography
                                    textAlign={"center"}
                                    variant="body1"
                                    fontSize={13}
                                    fontWeight={700}
                                    color="text.primary">
                                    {row?.createdAt?.replaceAll("-", "/") ?? "--"}
                                </Typography>
                            </>
                        ) : (
                            <Skeleton variant="text" width={100}/>
                        )}
                    </Stack>
                </Box>
            </CardContent>
        </CardStyled>
    )
}

export default DepartmentMobileCard
