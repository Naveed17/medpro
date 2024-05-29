import TableCell from "@mui/material/TableCell";
import {
    Typography,
    Box,
    Stack,
    Skeleton,
    useTheme,
    IconButton
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useRouter} from "next/router";
import {editUser, TableRowStyled} from "@features/table";
import {useAppDispatch} from "@lib/redux/hooks";
import {uniqueId} from "lodash";
import React, {useState} from "react";
import {CustomSwitch} from "@features/buttons";
import Can from "@features/casl/can";

function UserRow({...props}) {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const router = useRouter();
    const {row, handleChange, handleEvent, t, editMotif, data} = props;
    const {currentUser} = data;

    const [isActive, setIsActive] = useState(row.isActive);

    return (
        <TableRowStyled
            key={uniqueId}
            className="user-row"
            onClick={() => handleEvent("onUserDetail", row)}>
            <TableCell>
                {row ? (
                    <>
                        <Typography variant="body1" fontWeight={700} color="text.primary">
                            {row.firstName} {row.lastName}
                        </Typography>
                        <span onClick={event => event.stopPropagation()}>{row.email}</span>
                    </>
                ) : (
                    <Stack>
                        <Skeleton variant="text" width={100}/>
                        <Skeleton variant="text" width={100}/>
                    </Stack>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <>
                        <Typography
                            textAlign={"center"}
                            variant="body1"
                            fontSize={13}
                            fontWeight={700}
                            color="text.primary">
                            {row.isProfessional ? t("table.role_professional") : t("table.secretary")}
                        </Typography>
                    </>
                ) : (
                    <Stack alignItems="center">
                        <Skeleton variant="text" width={100}/>
                        <Skeleton variant="text" width={100}/>
                    </Stack>
                )}
            </TableCell>
            <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                {row ? !row?.isProfessional && <CustomSwitch
                    className="custom-switch"
                    name="active"
                    onChange={(e) => {
                        setIsActive(e.target.checked);
                        handleChange("ACCESS", row, e);
                    }}
                    checked={isActive}
                /> : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="center">
                <Stack direction='row' alignItems='center' spacing={.5}>
                    <IconUrl path="ic-agenda-jour"/>
                    <Typography variant="body1" fontSize={13} fontWeight={700} color="text.primary">
                        10/10/2022
                    </Typography>
                    <IconUrl path="ic-time"/>
                    <Typography variant="body1" fontWeight={700} fontSize={13} color="text.primary">
                        09:30
                    </Typography>
                </Stack>
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Box display="flex" sx={{float: "right"}} alignItems="center">
                        <Can I={"manage"} a={"settings"} field={"settings__users__update"}>
                            {row?.ssoId === currentUser && <IconButton
                                size="small"
                                color="primary"
                                className="btn-edit"
                                onClick={() => {
                                    dispatch(editUser(row));
                                    router.push(`${router.pathname}/${row.ssoId}`, `${router.pathname}/${row.ssoId}`, {locale: router.locale});
                                }}>
                                <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                            </IconButton>}
                        </Can>
                        <Can I={"manage"} a={"settings"} field={"settings__users__delete"}>
                            {!row.isProfessional &&
                                <IconButton
                                    className={"delete-icon"}
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        editMotif(row);
                                    }}
                                    sx={{
                                        mr: {md: 1},
                                        '& .react-svg svg': {
                                            width: 20,
                                            height: 20
                                        }
                                    }}>
                                    <IconUrl color={theme.palette.text.secondary} path="ic-trash"/>
                                </IconButton>}
                        </Can>
                    </Box>
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
            </TableCell>
        </TableRowStyled>
    );
}

export default UserRow;
