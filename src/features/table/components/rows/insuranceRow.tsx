import {TableRowStyled} from "@features/table"
import TableCell from '@mui/material/TableCell';
import {Typography, Skeleton, Avatar, FormControlLabel, Checkbox, Stack} from '@mui/material';
import {uniqueId} from 'lodash'
import ListItemIcon from "@mui/material/ListItemIcon";
import {ImageHandler} from "@features/image";
import ListItemText from "@mui/material/ListItemText";
import React, {useState} from "react";
import {LoadingButton} from "@mui/lab";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";

function InsuranceRow({...props}) {
    const {row, data, handleEvent, t} = props;
    const {loadingReq} = data;
    const [backgroundDoc, setBackgroundDoc] = useState(true);

    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ?
                    <Stack direction={"row"} alignItems={"center"}>
                        <ListItemIcon>
                            <Avatar
                                sx={{width: 30, height: 30}}
                                variant={"circular"}>
                                <ImageHandler
                                    alt={row.name}
                                    src={row.logoUrl.url}
                                />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography variant={"body2"}>{row.name}</Typography>}/>
                    </Stack>
                    : <Skeleton variant="text" width={100}/>}
            </TableCell>

            <TableCell align="right">
                <Stack direction={"row"} spacing={1.2} justifyContent={"end"}>
                    <FormControlLabel
                        control={<Checkbox
                            size={"small"}
                            checked={backgroundDoc}
                            onChange={e => setBackgroundDoc(e.target.checked)}/>}
                        label={t("consultationIP.print_document_background")}/>
                    <LoadingButton
                        loading={loadingReq}
                        size={"small"}
                        loadingPosition={"start"}
                        variant={"contained"}
                        startIcon={backgroundDoc ? <LocalPrintshopRoundedIcon/> : <LocalPrintshopOutlinedIcon/>}
                        onClick={() => handleEvent("onGenerateInsuranceDoc", row, backgroundDoc)}>
                        <Typography fontSize={13}>{t("consultationIP.print_document_result")}</Typography>
                    </LoadingButton>
                </Stack>
            </TableCell>
        </TableRowStyled>
    )
}

export default InsuranceRow
