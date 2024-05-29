import React from "react";
import TableCell from "@mui/material/TableCell";
import { IconButton, Typography, Skeleton, Box, Stack, useTheme } from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { TableRowStyled } from "@features/table";
import { uniqueId } from "lodash";
import { ModelDot } from "@features/modelDot";
import { IconsTypes } from "@features/calendar";
import Can from "@features/casl/can";

function MotifRow({ ...props }) {
    const { row, editMotif } = props;
    const theme = useTheme();

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell colSpan={3}>
                {row ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <ModelDot
                            icon={IconsTypes[row.icon]}
                            color={row.color}
                            selected={false}
                            {...(theme.direction === "rtl" && {
                                style: {
                                    marginLeft: 8
                                }
                            })}
                            marginRight={theme.direction === "rtl" ? 0 : 15}></ModelDot>

                        <Stack direction="row" spacing={0.7} alignItems="center">
                            <Typography variant="body1" color="text.primary">
                                {row.name}
                            </Typography>
                        </Stack>
                    </Box>
                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    row.isFree || row.price === null || row.price === 0 ? (
                        <Typography>--</Typography>
                    ) : (
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            justifyContent="center">
                            <IconUrl path="ic-argent" />
                            <Typography>{row.price}</Typography>
                        </Stack>
                    )
                ) : (
                    <Skeleton width={30} height={40} sx={{ mx: "auto" }} />
                )}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Stack direction='row' alignItems='center' justifyContent='flex-end'>
                        <Can I={"manage"} a={"settings"} field={"settings__consultation-type__update"}>
                            <IconButton
                                size="small"
                                className="btn-edit"
                                sx={{ mr: { md: 1 } }}
                                onClick={() => editMotif(row, "edit")}>
                                <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                            </IconButton>
                        </Can>
                        <Can I={"manage"} a={"settings"} field={"settings__consultation-type__delete"}>
                            {!row.hasData && <IconButton
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
                            </IconButton>}
                        </Can>
                    </Stack>
                ) : (
                    <Skeleton width={30} height={40} sx={{ m: "auto" }} />
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default MotifRow;
