import React from 'react'
import CardStyled from './overrides/cardStyle'
import { Box, CardContent, IconButton, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { CustomSwitch } from '@features/buttons';
import IconUrl from '@themes/urlIcon';
import Can from "@features/casl/can";
function DepartmentMobileCard({ ...props }) {
    const { row, t, handleEvent } = props;
    const theme = useTheme();
    return (
        <CardStyled>
            <CardContent>
                <Stack direction='row' alignItems='center'>
                    {row ? (
                        <Typography fontWeight={600} color="text.primary" fontSize={16}>
                            Gynocolgy
                        </Typography>
                    ) : (
                        <Stack>
                            <Skeleton variant="text" width={100} />
                        </Stack>
                    )}
                    <Stack direction='row' alignItems='center' spacing={.2} ml={1.5}>
                        <CustomSwitch
                            className="custom-switch"
                            name="active"
                        />
                        <Typography
                            variant="body2"
                            fontWeight={500}
                            color="text.primary">
                            {t("table.active")}
                        </Typography>
                    </Stack>
                    {row ? (
                        <Stack direction='row' alignItems="center" ml="auto">
                            <Can I={"manage"} a={"settings"} field={"settings__users__update"}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEvent("EDIT_DOCTOR", row)
                                    }}
                                    color="primary"
                                    className="btn-edit">
                                    <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient" />
                                </IconButton>
                            </Can>
                            <Can I={"manage"} a={"settings"} field={"settings__users__delete"}>
                                <IconButton
                                    className={"delete-icon"}
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEvent("DELETE_DOCTOR", row)
                                    }}
                                    sx={{
                                        ml: { md: 1 },
                                        '& .react-svg svg': {
                                            width: 20,
                                            height: 20
                                        }
                                    }}>
                                    <IconUrl color={theme.palette.text.secondary} path="ic-trash" />
                                </IconButton>
                            </Can>
                        </Stack>
                    ) : (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="flex-end">
                            <Skeleton variant="text" width={50} />
                            <Skeleton variant="text" width={50} />
                        </Stack>
                    )}
                </Stack>
                <Box className="row" mt={2}>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant='body2' color="textSecondary" fontWeight={500}>{t("table.department-head")} :</Typography>
                        {row ? (
                            <>
                                <Typography
                                    textAlign={"center"}
                                    variant="body1"
                                    fontSize={13}
                                    fontWeight={700}
                                    color="text.primary">
                                    Dr. Samantha
                                </Typography>
                            </>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant='body2' color="textSecondary" fontWeight={500}>{t("table.date")} :</Typography>
                        {row ? (
                            <>
                                <Typography
                                    textAlign={"center"}
                                    variant="body1"
                                    fontSize={13}
                                    fontWeight={700}
                                    color="text.primary">
                                    0/10/2022
                                </Typography>
                            </>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )}
                    </Stack>
                </Box>
            </CardContent>
        </CardStyled>
    )
}

export default DepartmentMobileCard