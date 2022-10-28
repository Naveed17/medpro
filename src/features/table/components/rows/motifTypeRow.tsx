import React from "react";
import TableCell from "@mui/material/TableCell";
import {IconButton, Typography, Skeleton, Box, Stack} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {TableRowStyled} from "@features/table";
import {uniqueId} from "lodash";
import {useTranslation} from "next-i18next";
import {ModelDot} from "@features/modelDot";
import {IconsTypes} from "@features/calendar";

function MotifRow({...props}) {
    const {row, editMotif, data} = props;
    const {t, ready} = useTranslation("common");
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
                            icon={IconsTypes[row.icon]}
                            color={row.color}
                            selected={false}
                            marginRight={15}></ModelDot>

                        <Stack direction="row" spacing={0.7} alignItems="center">
                            <Typography variant="body1" color="text.primary">
                                {row.name}
                            </Typography>
                        </Stack>
                    </Box>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <IconButton
                        size="small"
                        sx={{mr: {md: 1}}}
                        onClick={() => editMotif(row)}>
                        <IconUrl path="setting/edit"/>
                    </IconButton>
                ) : (
                    <Skeleton width={30} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default MotifRow;
