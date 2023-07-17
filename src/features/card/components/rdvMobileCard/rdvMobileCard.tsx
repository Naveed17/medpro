import React from "react";
// material
import {Box, IconButton, Stack, TableCell, Typography,} from "@mui/material";
import RootStyled from "./overrides/rootStyled";
// icon
import Icon from "@themes/urlIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// ____________________

function RDVMobileCard({...props}) {
    const {inner} = props;
    return inner && (
        <tr>
            <TableCell colSpan={4} sx={{p: "0!important"}}>
                <RootStyled
                    sx={{
                        "&:before": {
                            bgcolor: inner?.consultationReason?.color,
                        },
                    }}
                >
                    <Stack direction="row" spacing={2}>
                        <Box className="card-main">
                            <Typography
                                component="span"
                                variant="body2"
                                color="primary.main"
                                className="title"
                            >
                                {inner.meeting ? <Icon path="ic-video"/> : null}

                                <span>{inner.title}</span>
                            </Typography>
                            <Box className="time-badge-main">
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    mr={1}
                                    className="time-main"
                                >
                                    <Icon path="ic-agenda"/>
                                    <span>{inner.dayDate}</span>
                                </Typography>

                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    className="time-main"
                                >
                                    <Icon path="ic-time"/>
                                    <span>{inner.startTime}</span>
                                </Typography>
                            </Box>
                        </Box>
                        <Box className="action">
                            <IconButton size="small">
                                <MoreVertIcon fontSize="small"/>
                            </IconButton>
                        </Box>
                    </Stack>
                </RootStyled>
            </TableCell>
        </tr>
    );
}

export default RDVMobileCard;
