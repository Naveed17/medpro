import React from "react";
import TableCell from "@mui/material/TableCell";
import {IconButton, Typography, Skeleton, Stack, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {TableRowStyled} from "@features/table";
import {uniqueId} from "lodash";

function Profile({...props}) {
    const {row, handleEvent} = props;
    const theme = useTheme();

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
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
                    <Stack direction='row' alignItems='center' justifyContent='flex-end'>
                        <IconButton
                            size="small"
                            sx={{mr: {md: 1}}}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEvent({action: "EDIT_PROFILE", row, e});
                            }}>
                            <IconUrl color={theme.palette.primary.main} path="ic-edit-patient"/>
                        </IconButton>
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
                                handleEvent({action: "DELETE_PROFILE", row, e});
                            }}>
                            <IconUrl color={theme.palette.error.main} path="ic-trash"/>
                        </IconButton>
                    </Stack>
                ) : (
                    <Skeleton width={30} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default Profile;
