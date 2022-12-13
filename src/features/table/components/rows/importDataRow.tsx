import TableCell from "@mui/material/TableCell";
import {Typography, Box, Stack, Skeleton, TableRow, Collapse, Table, Checkbox, Chip} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useRouter} from "next/router";
import Button from "@mui/material/Button";
import {TableRowStyled} from "@features/table";
import {useAppDispatch} from "@app/redux/hooks";
import {editUser} from "@features/table";
import {uniqueId} from "lodash";
import {Theme} from "@mui/material/styles";
import {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';

function ImportDataRow({...props}) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {pathname, locale} = router;
    const {row, labelId, handleClick, loading = false, t, editMotif} = props;
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <TableRowStyled
                onClick={() => setExpanded(!expanded)}
                key={uniqueId}>
                <TableCell>
                    {row ? (
                        <Stack direction={"row"} alignItems={"center"}>
                            {expanded ? <RemoveIcon className={"expand-icon"}/> : <AddIcon className={"expand-icon"}/>}
                            <Typography variant="body1" color="text.primary">
                                {row.date}
                            </Typography>

                            {row.collapse[0].errors &&
                                <Chip sx={{marginLeft: 1, height: 26}}
                                      color={"error"}
                                      icon={<IconUrl color={"black"} path={"danger"}/>}
                                      label={`${"3"} ${t("error.title")}`}/>}

                            {row.collapse[0].warning &&
                                <Chip sx={{marginLeft: 1, height: 26}}
                                      color={"warning"}
                                      icon={<ErrorIcon />}
                                      label={`${"3"} ${t("error.warning-title")}`}/>}

                            {row.collapse[0].info &&
                                <Chip sx={{marginLeft: 1, height: 26}}
                                      color={"info"}
                                      icon={<HelpIcon color={"inherit"} />}
                                      label={`${"3"} ${t("error.info-title")}`}/>}
                        </Stack>
                    ) : (
                        <Stack>
                            <Skeleton variant="text" width={100}/>
                            <Skeleton variant="text" width={100}/>
                        </Stack>
                    )}
                </TableCell>
                <TableCell>
                    {row ? (
                        <Stack direction={"row"} alignItems={"center"}>
                            <Typography variant="body1" color="text.primary">
                                {row.source}
                            </Typography>
                        </Stack>
                    ) : (
                        <Stack>
                            <Skeleton variant="text" width={100}/>
                            <Skeleton variant="text" width={100}/>
                        </Stack>
                    )}
                </TableCell>
                <TableCell align="right">
                    {row ? (
                        <Box display="flex" sx={{float: "right"}} alignItems="center">
                            <Button
                                variant="text"
                                size="small"
                                color="primary"
                                startIcon={<IconUrl path="setting/edit"/>}
                                onClick={() => {
                                    dispatch(editUser(row));
                                    router.push(`${pathname}/${row.uuid}`, undefined, {
                                        locale,
                                    });
                                }}>
                                {t("table.update")}
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                color="error"
                                startIcon={<IconUrl path="setting/icdelete"/>}
                                onClick={() => editMotif(row)}
                                sx={{mr: 1}}>
                                {t("table.remove")}
                            </Button>
                        </Box>
                    ) : (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="flex-end">
                            <Skeleton variant="text" width={50}/>
                            <Skeleton variant="text" width={50}/>
                        </Stack>
                    )}
                </TableCell>
            </TableRowStyled>
            {
                row.collapse &&
                <TableRow>
                    <TableCell colSpan={9} style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderTop: 'none',
                        borderBottom: 'none',
                        padding: 0,
                        lineHeight: 0,
                    }}>
                        <Collapse in={expanded} timeout="auto" unmountOnExit sx={{pl: 6}}>
                            <Table>
                                <tbody>
                                {row.collapse.map((col: any, idx: number) => {
                                    return <TableRow hover
                                                     role="checkbox"
                                                     key={idx}
                                                     className="collapse-row"
                                                     sx={{
                                                         bgcolor: (theme: Theme) => theme.palette.background.paper
                                                     }}>
                                        <TableCell
                                            style={{backgroundColor: 'transparent', border: 'none', width: "auto"}}
                                            padding="checkbox">
                                            {loading ? (
                                                <Skeleton variant="circular" width={28} height={28}/>
                                            ) : (
                                                <>
                                                    {col.errors && col.errors}
                                                    {col.warning && col.warning}
                                                    {col.info && col.info}
                                                </>

                                            )}
                                        </TableCell>
                                    </TableRow>
                                })
                                }
                                </tbody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            }
        </>
    );
}

export default ImportDataRow;
