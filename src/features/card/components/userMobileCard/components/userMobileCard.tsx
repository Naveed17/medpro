import React from 'react'
import UserMobileCardStyled from './overrides/userMobileCardStyle'
import { CardContent, Typography, Theme, useTheme, Stack, IconButton } from '@mui/material';
import Lable from "@themes/overrides/Lable";
import { editUser } from "@features/table";
import Can from "@features/casl/can"
import { useRouter } from 'next/router';
import { useAppDispatch } from '@lib/redux/hooks';
import IconUrl from '@themes/urlIcon';

function UserMobileCard({ ...props }) {
    const theme: Theme = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data, t, currentUser, edit } = props;

    return (
        <UserMobileCardStyled sx={{
            borderLeftColor: data.isActive ? theme.palette.success.main : theme.palette.error.main,
        }}>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1" color="text.primary" fontWeight={600}>
                        {data.FirstName} {data.lastName}
                    </Typography>
                    <Lable variant="filled" color={data.isActive ? "success" : "error"} sx={{ px: 1.5 }}>
                        {data.isActive ? t("table.active") : t("table.inactive")}
                    </Lable>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                        {data.email}</Typography>
                    <Stack direction='row' alignItems="center">
                        <Can I={"manage"} a={"settings"} field={"settings__users__update"}>
                            {data?.ssoId === currentUser && <IconButton
                                size="small"
                                color="primary"
                                className="btn-edit"
                                onClick={() => {
                                    dispatch(editUser(data));
                                    router.push(`${router.pathname}/${data.ssoId}`, `${router.pathname}/${data.ssoId}`, { locale: router.locale });
                                }}>
                                <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient" />
                            </IconButton>}
                        </Can>
                        <Can I={"manage"} a={"settings"} field={"settings__users__delete"}>
                            {!data.isProfessional &&
                                <IconButton
                                    className={"delete-icon"}
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        edit(data);
                                    }}
                                    sx={{
                                        mr: { md: 1 },
                                        '& .react-svg svg': {
                                            width: 20,
                                            height: 20
                                        }
                                    }}>
                                    <IconUrl color={theme.palette.text.secondary} path="ic-trash" />
                                </IconButton>}
                        </Can>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography textTransform='capitalize' variant="body2">
                        {t("table.access")}:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {data.isProfessional ? t("table.role_professional") : t("table.secretary")}
                    </Typography>
                </Stack>
            </CardContent>
        </UserMobileCardStyled>
    )
}

export default UserMobileCard
