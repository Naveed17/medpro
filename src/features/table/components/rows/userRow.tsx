import Lable from "@themes/overrides/Lable";
import TableCell from "@mui/material/TableCell";
import {Typography, Box, Stack, Skeleton} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useRouter} from "next/router";
import Button from "@mui/material/Button";
import {TableRowStyled} from "@features/table";
import Switch from "@mui/material/Switch";
import {useAppDispatch} from "@lib/redux/hooks";
import {uniqueId} from "lodash";
import {useState} from "react";

function UserRow({...props}) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {row, handleChange, t, editMotif} = props;
    const [isActive, setIsActive] = useState(row.isActive);
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
            {/*<TableCell align="center">
                {row ? (
                    <Lable variant="filled" color={row.isActive ? "success" : "error"} sx={{px: 1.5}}>
                        {row.isActive ? t("table.active") : t("table.inactive")}
                    </Lable>
                ) : (
                    <Skeleton
                        variant="text"
                        width={100}
                        height={40}
                        sx={{mx: "auto"}}
                    />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Switch
                        name="active"
                        onChange={(e) => {
                            setIsActive(e.target.checked);
                            handleChange("ACCESS", row, e)
                        }
                        }
                        checked={isActive}
                    />
                ) : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>*/}
            <TableCell align="center">
                {row ? (
                    <Switch
                        name="active"
                        onChange={(e) => {
                            setHasDocPermission(e.target.checked);
                            handleChange("DOC_PERMISSION", row, e)
                        }}
                        checked={hasDocPermission}
                    />
                ) : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
            {/* <TableCell align="center">
                {row ? (
                    <Typography className="name" variant="body1" color="text.primary">
                        {row.isIntern} {t("table.agenda")}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={100} sx={{m: "auto"}}/>
                )}
            </TableCell> */}
            {/*            <TableCell align="right">
                {row ? (
                    <Box display="flex" sx={{float: "right"}} alignItems="center">
                        <Button
                            variant="text"
                            size="small"
                            color="primary"
                            startIcon={<IconUrl path="setting/edit"/>}
                            onClick={() => {
                                dispatch(editUser(row));
                                router.push(`${pathname}/${row.uuid}`, undefined, {
                                    locale,
                                });
                            }}>
                            {t("table.update")}
                        </Button>
                        <Button
                            variant="text"
                            size="small"
                            color="error"
                            startIcon={<IconUrl path="setting/icdelete"/>}
                            onClick={() => editMotif(row)}
                            sx={{mr: 1}}>
                            {t("table.remove")}
                        </Button>
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
            </TableCell>*/}
        </TableRowStyled>
    );
}

export default UserRow;
