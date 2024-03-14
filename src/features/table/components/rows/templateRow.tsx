import React from "react";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import { IconButton, Typography, Skeleton, Box, useTheme } from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { TableRowStyled } from "@features/table";
import { uniqueId } from "lodash";
import { ModelDot } from "@features/modelDot";
import Can from "@features/casl/can";

function MotifRow({ ...props }) {
    const { row, handleChange, editMotif } = props;
    const theme = useTheme();
    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <ModelDot
                            color={row.color}
                            selected={false}
                            {...(theme.direction === 'rtl' && {
                                style: {
                                    marginLeft: 15
                                }
                            })}
                            marginRight={theme.direction === "rtl" ? 0 : 15}></ModelDot>

                        <Typography variant="body1" color="text.primary">
                            {row.label}
                        </Typography>
                    </Box>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                <Switch
                    name="active"
                    onChange={() => handleChange(row, "active", "")}
                    checked={row.isEnabled}
                />
            </TableCell>

            <TableCell align="right">
                {row ? (
                    <>
                        <IconButton
                            size="small"
                            sx={{ mr: { md: 1 } }}
                            onClick={() => editMotif(row, "see")}>
                            <IconUrl width={20} height={20} color={theme.palette.text.secondary} path="ic-open-eye" />
                        </IconButton>
                        {!row.hasData &&
                            <>
                                <Can I={"manage"} a={"settings"} field={"settings__patient-file-templates__update"}>
                                    <IconButton
                                        size="small"
                                        className="btn-edit"
                                        sx={{ mr: { md: .5 } }}
                                        onClick={() => editMotif(row, "edit")}>
                                        <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                                    </IconButton>
                                </Can>
                                <Can I={"manage"} a={"settings"} field={"settings__patient-file-templates__delete"}>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            mr: { md: 1 },
                                            '& .react-svg svg': {
                                                width: 20,
                                                height: 20
                                            }
                                        }}
                                        onClick={() => editMotif(row, "delete")}>
                                        <IconUrl color={theme.palette.text.secondary} path="ic-trash"/>
                                    </IconButton>
                                </Can>
                            </>}
                    </>
                ) : (
                    <Skeleton width={30} height={40} sx={{ m: "auto" }} />
                )}
            </TableCell>
        </TableRowStyled>
    )
        ;
}

export default MotifRow;
