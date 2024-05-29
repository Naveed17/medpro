import React from "react";
import TableCell from "@mui/material/TableCell";
import {IconButton, Typography, Skeleton, Stack, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {TableRowStyled} from "@features/table";
import {uniqueId} from "lodash";
import Can from "@features/casl/can";

function MedicalImagingRow({...props}) {
    const {row, editMotif} = props;
    const theme = useTheme();

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell colSpan={3}>
                {row ? (
                    row.name ?
                        (
                            <Typography variant="body1" color="text.primary">
                                {row.name}
                            </Typography>
                        )
                        : (
                            <Typography>--</Typography>
                        )

                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={1}>
                        <Can I={"manage"} a={"settings"} field={"settings__medical-imaging__update"}>
                            <IconButton
                                size="small"
                                className="btn-edit"
                                onClick={() => editMotif(row, "edit")}>
                                <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                            </IconButton>
                        </Can>
                        <Can I={"manage"} a={"settings"} field={"settings__medical-imaging__delete"}>
                            <IconButton
                                size="small"
                                sx={{
                                    mr: {md: 1},
                                    '& .react-svg svg': {
                                        width: 20,
                                        height: 20
                                    }
                                }}
                                onClick={() => editMotif(row, "delete")}>
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

export default MedicalImagingRow;
