import React, {useMemo} from "react";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import {
    IconButton,
    Typography,
    Skeleton,
    Box,
    Stack,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {TableRowStyled} from "@features/table";
import {useTranslation} from "next-i18next";
import {ModelDot} from "@features/modelDot";
import {useTheme} from "@mui/material/styles";
import Can from "@features/casl/can";

function MotifRow({...props}) {
    const {row, handleChange, editMotif} = props;
    const {t} = useTranslation("common");
    const theme = useTheme();
    const duration = useMemo(() => {
            if (row.duration < 60) {
                return row.duration + " " + t("times.minutes");
            }
            if (row.duration > 59 && row.duration < 120) {
                return row.duration / 60 + " " + t("times.hour");
            }
            if (row.duration > 119) {
                return row.duration / 60 + " " + t("times.hours");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [row.duration]);

    return (
        <TableRowStyled key={row.uuid}>
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
                            marginRight={15}></ModelDot>

                        <Typography variant="body1" color="text.primary">
                            {row.name}
                        </Typography>
                    </Box>
                ) : (
                    <Skeleton variant="text" width={100}/>
                )}
            </TableCell>
            <TableCell>
                {
                    row ?
                        <Typography>{duration}</Typography>
                        : <Skeleton variant="rectangular" width={150} height={30}/>}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Switch
                        name="active"
                        onChange={() => handleChange(row, "active", "")}
                        checked={row.isEnabled}
                    />
                ) : (
                    <Skeleton width={50} height={40} sx={{m: "auto"}}/>
                )}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                        <Can I={"manage"} a={"settings"} field={"settings__motif__update"}>
                            <IconButton
                                size="small"

                                onClick={() => editMotif(row, "edit")}>
                                <IconUrl color={theme.palette.primary.main} path="ic-edit-patient"/>
                            </IconButton>
                        </Can>
                        <Can I={"manage"} a={"settings"} field={"settings__motif__delete"}>
                            <IconButton
                                size="small"
                                sx={{
                                    '& .react-svg svg': {
                                        width: 20,
                                        height: 20
                                    }
                                }}
                                onClick={() => editMotif(row, "delete")}>
                                <IconUrl color={theme.palette.error.main} path="ic-trash"/>
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

export default MotifRow;
