import React from "react";
import TableCell from "@mui/material/TableCell";
import {IconButton, Typography, Skeleton, Stack, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {TableRowStyled} from "@features/table";
import {uniqueId} from "lodash";
import Can from "@features/casl/can";

function Drugs({...props}) {
    const {row, handleEvent} = props;
    const theme = useTheme();

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ? (
                    row.commercial_name ?
                        (
                            <Typography variant="body1" color="text.primary">
                                {row.commercial_name}
                            </Typography>
                        )
                        : (
                            <Typography>--</Typography>
                        )

                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    !row.dci ? (
                        <Typography>--</Typography>
                    ) : (

                        <Typography>{row.dci?.name}</Typography>

                    )
                ) : (
                    <Skeleton width={30} height={40} sx={{mx: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    !row.form ? (
                        <Typography>--</Typography>
                    ) : (

                        <Typography>{row.form?.name}</Typography>

                    )
                ) : (
                    <Skeleton width={30} height={40} sx={{mx: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    !row.laboratory ? (
                        <Typography>--</Typography>
                    ) : (

                        <Typography>{row.laboratory?.name}</Typography>

                    )
                ) : (
                    <Skeleton width={30} height={40} sx={{mx: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Stack direction='row' alignItems='center' justifyContent='flex-end'>
                        <Can I={"manage"} a={"settings"} field={"settings__drugs__update"}>
                            <IconButton
                                size="small"
                                className="btn-edit"
                                sx={{mr: {md: 1}}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEvent({action: "EDIT_DRUGS", row, e});
                                }}>
                                <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                            </IconButton>
                        </Can>
                        <Can I={"manage"} a={"settings"} field={"settings__drugs__delete"}>
                            <IconButton
                                size="small"
                                sx={{
                                    mr: {md: 1},
                                    '& .react-svg svg': {
                                        width: 20,
                                        height: 20
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEvent({action: "DELETE_DRUGS", row, e});
                                }}>
                                <IconUrl color={theme.palette.text.secondary} path="ic-trash"/>
                            </IconButton>
                        </Can>
                    </Stack>
                ) : (
                    <Skeleton width={30} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default Drugs;
