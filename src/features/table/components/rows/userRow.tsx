import TableCell from "@mui/material/TableCell";
import {Typography, Box, Stack, Skeleton, Select, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useRouter} from "next/router";
import Button from "@mui/material/Button";
import {editUser, TableRowStyled} from "@features/table";
import Switch from "@mui/material/Switch";
import {useAppDispatch} from "@lib/redux/hooks";
import {uniqueId} from "lodash";
import React, {useState} from "react";
import MenuItem from "@mui/material/MenuItem";

function UserRow({...props}) {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const router = useRouter();
    const {row, handleChange, t, editMotif, data} = props;
    const {currentUser, profiles} = data;
    const [hasDocPermission, setHasDocPermission] = useState(row.canSeeDoc);

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ? (
                    <>
                        <Typography variant="body1" color="text.primary">
                            {row.FirstName} {row.lastName}
                        </Typography>
                        {row.email}
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
            <TableCell align="center">
                {!row?.isProfessional && <Select
                    size={"small"}
                    displayEmpty
                    value={row?.profile?.uuid ?? ''}
                    sx={{
                        maxHeight: 35,
                        width: 160,
                        "& .MuiSelect-select": {
                            background: "white",
                        },
                    }}
                    id="profile-select"
                    onChange={(event) => handleChange("PROFILE", row, event.target.value)}
                    renderValue={(selected: any) => {
                        if (!selected || (selected && selected.length === 0)) {
                            return <em>{t("profile-placeholder")}</em>;
                        }

                        return profiles.find((profile: ProfileModel) => profile?.uuid === selected)?.name;
                    }}>
                    {profiles.map((subItem: any) => (
                        <MenuItem
                            key={subItem.uuid}
                            value={subItem.uuid}>
                            {subItem.name}
                        </MenuItem>
                    ))}
                </Select>}
            </TableCell>
            <TableCell align="center">
                {row ? !row?.isProfessional && <Switch
                    name="active"
                    onChange={(e) => {
                        setHasDocPermission(e.target.checked);
                        handleChange("DOC_PERMISSION", row, e)
                    }}
                    checked={hasDocPermission}
                /> : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Box display="flex" sx={{float: "right"}} alignItems="center">
                        {row?.ssoId === currentUser && <Button
                            variant="text"
                            size="small"
                            color="primary"
                            startIcon={<IconUrl color={theme.palette.primary.main} path="ic-edit-patient"/>}
                            onClick={() => {
                                dispatch(editUser(row));
                                router.push(`${router.pathname}/${row.ssoId}`, `${router.pathname}/${row.ssoId}`, {locale: router.locale});
                            }}>
                            {t("table.update")}
                        </Button>}
                        {!row.isProfessional && <Button
                            className={"delete-icon"}
                            variant="text"
                            size="small"
                            color="error"
                            startIcon={<IconUrl color={theme.palette.error.main} path="ic-trash"/>}
                            onClick={() => editMotif(row)}
                            sx={{
                                mr: {md: 1},
                                '& .react-svg svg': {
                                    width: 20,
                                    height: 20
                                }
                            }}>
                            {t("table.remove")}
                        </Button>}
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
