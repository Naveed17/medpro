import TableCell from "@mui/material/TableCell";
import {
    Typography,
    Box,
    Stack,
    Skeleton,
    useTheme,
    Autocomplete,
    ListItem,
    ListItemText,
    TextField, CircularProgress, IconButton
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useRouter} from "next/router";
import {editUser, TableRowStyled} from "@features/table";
import {useAppDispatch} from "@lib/redux/hooks";
import {uniqueId} from "lodash";
import React, {useEffect, useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {CustomSwitch} from "@features/buttons";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Can from "@features/casl/can";

function UserRow({...props}) {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {row, handleChange, t, editMotif, data} = props;
    const {currentUser} = data;

    const [hasDocPermission, setHasDocPermission] = useState(row.canSeeDoc);
    const [profiles, setpProfiles] = useState([]);
    const [openAutoComplete, setOpenAutoComplete] = useState(false);
    const [loading, setLoading] = useState(false);

    const {trigger: drugsTrigger} = useRequestQueryMutation("/settings/drugs/get");

    const loadingReq = openAutoComplete;

    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!loadingReq) {
            return undefined;
        }

        (async () => {
            setLoading(true);
            drugsTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/profile/${router.locale}`
            }, {
                onSuccess: (result) => {
                    setpProfiles((result?.data as HttpResponse)?.data);
                    setLoading(false);
                }
            });
        })();
    }, [loadingReq]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <TableRowStyled key={uniqueId} className="user-row">
            <TableCell>
                {row ? (
                    <>
                        <Typography variant="body1" fontWeight={700} color="text.primary">
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
            <TableCell align="center">
                {!row?.isProfessional && <Autocomplete
                    size={"small"}
                    popupIcon={<KeyboardArrowDownIcon/>}
                    className="role-select"
                    value={profiles.find((profile: any) => profile.uuid === row?.profile?.uuid) ?? null}
                    inputValue={row?.profile?.name ?? ""}
                    disableClearable
                    sx={{
                        maxHeight: 35,
                        width: 160,
                        "& .MuiSelect-select": {
                            background: "white",
                        }
                    }}
                    id="profile-select"
                    open={openAutoComplete}
                    onOpen={() => setOpenAutoComplete(true)}
                    onClose={() => setOpenAutoComplete(false)}
                    onChange={(e, profile) => handleChange("PROFILE", row, profile?.uuid)}
                    getOptionLabel={(option: any) => option?.name ? option.name : ""}
                    isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
                    options={profiles}
                    renderOption={(props, option) => (
                        <ListItem {...props}>
                            <ListItemText primary={option?.name}/>
                        </ListItem>
                    )}
                    renderInput={params =>
                        <TextField
                            {...params}
                            color={"info"}
                            sx={{paddingLeft: 0}}
                            placeholder={t("profile-placeholder")}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ?
                                            <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),

                            }}
                            variant="outlined"
                            fullWidth/>}
                />}
            </TableCell>
            <TableCell align="center">
                {row ? !row?.isProfessional && <CustomSwitch
                    className="custom-switch"
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
                                    onClick={() => editMotif(row)}
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
