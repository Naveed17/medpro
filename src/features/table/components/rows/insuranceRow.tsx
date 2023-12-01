import {TableRowStyled} from "@features/table"
import TableCell from '@mui/material/TableCell';
import {
    Typography,
    Skeleton,
    Avatar,
    FormControlLabel,
    Checkbox,
    Stack,
    IconButton,
    Collapse,
    Table, TableBody
} from '@mui/material';
import {uniqueId} from 'lodash'
import ListItemIcon from "@mui/material/ListItemIcon";
import {ImageHandler} from "@features/image";
import ListItemText from "@mui/material/ListItemText";
import React, {useState} from "react";
import {LoadingButton} from "@mui/lab";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import moment from "moment-timezone";
import {alpha, Theme} from "@mui/material/styles";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TableRow from "@mui/material/TableRow";

function InsuranceRow({...props}) {
    const {row, data, handleEvent, t} = props;
    const {loadingReq} = data;
    const [backgroundDoc, setBackgroundDoc] = useState(true);
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRowStyled sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell onClick={() => setOpen(!open)}>
                    <Stack direction={"row"} alignItems={"center"}>
                        <IconButton
                            aria-label="expand row"
                            size="small">
                            {open ? <KeyboardArrowUpRoundedIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                        {row ?
                            <Stack ml={1} direction={"row"} alignItems={"center"}>
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
                    </Stack>

                </TableCell>
                <TableCell/>
            </TableRowStyled>

            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingLeft: '3rem'}}
                           {...(!open && {
                               style: {
                                   paddingBottom: 0,
                                   paddingTop: 0
                               }
                           })}
                           colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Table>
                            <TableBody>
                                {row.documents.map((doc: any, index: number) => (
                                    <tr key={index}>
                                        <td colSpan={6}>
                                            {row ?
                                                <Stack direction={"row"} alignItems={"center"}>
                                                    <ListItemText
                                                        primary={<Typography
                                                            variant={"body2"}>{doc.name}</Typography>}/>
                                                </Stack>
                                                : <Skeleton variant="text" width={100}/>}
                                        </td>

                                        <td align="right" colSpan={6}>
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
                                                    startIcon={backgroundDoc ? <LocalPrintshopRoundedIcon/> :
                                                        <LocalPrintshopOutlinedIcon/>}
                                                    onClick={() => handleEvent("onGenerateInsuranceDoc", doc, backgroundDoc)}>
                                                    <Typography
                                                        fontSize={13}>{t("consultationIP.print_document_result")}</Typography>
                                                </LoadingButton>
                                            </Stack>
                                        </td>
                                    </tr>))}
                            </TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

export default InsuranceRow
