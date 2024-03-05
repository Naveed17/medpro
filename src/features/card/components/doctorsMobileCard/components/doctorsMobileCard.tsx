import React from 'react'
import CardStyled from './overrides/cardStyle'
import { Avatar, Badge, Box, CardContent, IconButton, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { ConditionalWrapper } from '@lib/hooks';
import Zoom from "react-medium-image-zoom";
import IconUrl from '@themes/urlIcon';
import Can from "@features/casl/can";
import { Label } from '@features/label';
function DoctorsMobileCard({ ...props }) {
    const { row, t, edit } = props;
    const theme = useTheme()
    return (
        <CardStyled>
            <CardContent>
                <Stack spacing={1}>
                    <Stack direction="row">
                        {row ? (
                            <>
                                <Badge
                                    onClick={(event: any) => event.stopPropagation()}
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                                    <ConditionalWrapper
                                        condition={row.hasPhoto}
                                        wrapper={(children: any) => <Zoom>{children}</Zoom>}>
                                        <Stack direction={"row"} alignItems={"center"} spacing={2}>
                                            <Avatar
                                                {...(row.hasPhoto && { className: "zoom" })}
                                                src={"/static/icons/men-avatar.svg"}
                                                sx={{
                                                    "& .injected-svg": {
                                                        margin: 0
                                                    },
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 1
                                                }}>
                                                <IconUrl width={"36"} height={"36"} path="men-avatar" />
                                            </Avatar>
                                            <Typography variant="body1" fontWeight={700} color="primary">
                                                {row.FirstName} {row.lastName}
                                            </Typography>
                                            <Label
                                                className="label"
                                                variant="ghost"
                                                color={row?.isActive ? "success" : "error"}>
                                                {t(`table.${row?.isActive ? "active" : "inactive"}`)}
                                            </Label>
                                        </Stack>
                                    </ConditionalWrapper>
                                </Badge>

                            </>
                        ) : (
                            <Stack>
                                <Skeleton variant="text" width={100} />
                            </Stack>
                        )}

                        {row ? (
                            <Stack direction="row" alignItems="center" spacing={1} ml="auto">
                                <Can I={"manage"} a={"settings"} field={"settings__users__update"}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        className="btn-edit">
                                        <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient" />
                                    </IconButton>
                                </Can>
                                <Can I={"manage"} a={"settings"} field={"settings__users__delete"}>
                                    <IconButton
                                        className={"delete-icon"}
                                        size="small"
                                        onClick={() => edit(row)}
                                    >
                                        <IconUrl color={theme.palette.text.secondary} width={20} height={20} path="ic-trash" />
                                    </IconButton>
                                </Can>
                            </Stack>
                        ) : (
                            <Stack
                                direction="row"
                                spacing={1}
                                ml="auto"
                                alignItems="center"
                                justifyContent="flex-end">
                                <Skeleton variant="text" width={25} height={40} />
                                <Skeleton variant="text" width={25} height={40} />
                            </Stack>
                        )}

                    </Stack>
                    <Stack className='row'>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <Typography variant='body2' color="textSecondary" fontWeight={500}>{t("table.department")} :</Typography>
                            {row ? (
                                <>
                                    <Typography
                                        textAlign={"center"}
                                        variant="body1"
                                        fontSize={13}
                                        fontWeight={700}
                                        color="text.primary">
                                        {row?.department ?? "--"}
                                    </Typography>
                                </>
                            ) : (
                                <Skeleton variant="text" width={100} />
                            )}
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <Typography variant='body2' color="textSecondary" fontWeight={500}>{t("table.speciality")} :</Typography>
                            {row ? (
                                <>
                                    <Typography
                                        textAlign={"center"}
                                        variant="body1"
                                        fontSize={13}
                                        fontWeight={700}
                                        color="text.primary">
                                        {row?.speciality ?? "--"}
                                    </Typography>
                                </>
                            ) : (
                                <Stack alignItems="center">
                                    <Skeleton variant="text" width={100} />
                                </Stack>
                            )}
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <Typography variant='body2' color="textSecondary" fontWeight={500}>{t("table.contact")} :</Typography>
                            <Typography
                                textAlign={"center"}
                                variant="body1"
                                fontSize={13}
                                fontWeight={700}
                                color="text.primary">
                                {row?.email ?? "--"}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant='body2' color="textSecondary" fontWeight={500}>{t("table.join-date")} :</Typography>
                        <Typography
                            textAlign={"center"}
                            variant="body1"
                            fontSize={13}
                            fontWeight={700}
                            color="text.primary">
                            {row?.date ?? "--"}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </CardStyled>
    )
}

export default DoctorsMobileCard