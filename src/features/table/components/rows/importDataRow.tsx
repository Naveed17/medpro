import TableCell from "@mui/material/TableCell";
import {
    Typography,
    Box,
    Stack,
    Skeleton,
    TableRow,
    Collapse,
    Table,
    Chip,
    AlertTitle,
    Alert,
    List, ListItem, ListItemText
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import Button from "@mui/material/Button";
import {onOpenPatientDrawer, TableRowStyled} from "@features/table";
import {uniqueId} from "lodash";
import {Theme} from "@mui/material/styles";
import React, {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import {useAppDispatch} from "@app/redux/hooks";
import {LoadingButton} from "@mui/lab";

function ImportDataRow({...props}) {
    const {
        row, loading = false, t, handleEvent, errorsDuplication,
        setDuplicatedData, setDuplicateDetectedDialog,
        setPatientDetailDrawer
    } = props;
    const dispatch = useAppDispatch();

    const [infoDuplication, setInfoDuplication] = useState<Array<{
        key: string;
        row: string;
        data: PatientModel | null;
        fixed: boolean;
    }>>([]);
    const [warningAlertContainer, setWarningAlertContainer] = useState(false);
    const [infoAlertContainer, setInfoAlertContainer] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [loadingAction, setLoadingAction] = useState<boolean>(false);

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

                            {row.errors > 0 &&
                                <Chip sx={{marginLeft: 1, height: 26}}
                                      color={"error"}
                                      icon={<IconUrl color={"black"} path={"danger"}/>}
                                      label={`${row.errors} ${t("error.title")}`}/>}

                            {row.duplication > 0 &&
                                <Chip sx={{marginLeft: 1, height: 26}}
                                      color={"warning"}
                                      icon={<ErrorIcon/>}
                                      label={`${row.duplication} ${t("error.warning-title")}`}/>}

                            {row.info > 0 &&
                                <Chip sx={{marginLeft: 1, height: 26}}
                                      color={"info"}
                                      icon={<HelpIcon color={"inherit"}/>}
                                      label={`${row.info} ${t("error.info-title")}`}/>}
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
                                {(() => {
                                    switch (row.method) {
                                        case 'med-win':
                                            return <Box m={"auto"} width={44} height={14} component="img"
                                                        src={"/static/img/logo-wide.png"}/>
                                        case 'med-pro':
                                            return <IconUrl width={"20"} height={"20"} path={"Med-logo_"}/>
                                        case 'med-link':
                                            return <IconUrl width={"20"} height={"20"} path={"ic-upload"}/>
                                    }
                                })()}
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
                            <LoadingButton
                                {...{loading}}
                                onClick={() => {
                                    setLoadingAction(true);
                                    handleEvent("delete-import", row.uuid);
                                }}
                                variant="text"
                                size="small"
                                color="error"
                                startIcon={<RestartAltIcon/>}
                                sx={{mr: 1}}>
                                {t("table.reset")}
                            </LoadingButton>
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
                                                    {col.errors && <Alert
                                                        sx={{
                                                            marginBottom: 1
                                                        }}
                                                        action={
                                                            <Button variant={"contained"} color="error" size="small">
                                                                {t('load-file')}
                                                            </Button>
                                                        }
                                                        severity="error">
                                                        <AlertTitle>{t("error.title")}</AlertTitle>
                                                        {t("error.loading-error")} — <strong>{`${t("error.column")} acte ${t("error.missing")}, ${t("error.re-upload")}`}</strong>
                                                    </Alert>}
                                                    {col.warning && <Alert
                                                        action={
                                                            <Button variant={"contained"}
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setWarningAlertContainer(!warningAlertContainer);
                                                                    }}
                                                                    color="warning" size="small">
                                                                {t('error.see-all')}
                                                            </Button>
                                                        }
                                                        sx={{
                                                            marginBottom: 1
                                                        }}
                                                        severity="warning">
                                                        <Box onClick={(event) => {
                                                            event.stopPropagation();
                                                            setWarningAlertContainer(!warningAlertContainer);
                                                        }}>
                                                            <AlertTitle>{t("error.warning-title")}</AlertTitle>
                                                            {t("error.loading-error")} — <strong>{` ${errorsDuplication.length} ${t("error.duplicated")} , ${t("error.re-duplicate")}`}</strong>
                                                        </Box>
                                                        <Collapse in={warningAlertContainer} timeout="auto"
                                                                  unmountOnExit>
                                                            <List>
                                                                {errorsDuplication.map((error: any, index: number) => (
                                                                    <ListItem
                                                                        key={error.key}
                                                                        disableGutters
                                                                        secondaryAction={
                                                                            <Button variant={"contained"}
                                                                                    sx={{
                                                                                        visibility: !error.fixed ? "visible" : "hidden"
                                                                                    }}
                                                                                    onClick={(event) => {
                                                                                        event.stopPropagation();
                                                                                        setDuplicatedData(error);
                                                                                        setDuplicateDetectedDialog(true);
                                                                                    }}
                                                                                    color="warning" size="small">
                                                                                {t('error.fix-duplication')}
                                                                            </Button>
                                                                        }>
                                                                        <strong>{index} .</strong>
                                                                        <ListItemText sx={{
                                                                            textDecorationLine: error.fixed ? "line-through" : "none"
                                                                        }}
                                                                                      primary={`${t("error.duplicated-row")} ${error.row}`}/>
                                                                    </ListItem>))}
                                                            </List>
                                                        </Collapse>
                                                    </Alert>}
                                                    {col.info && <Alert
                                                        action={
                                                            <Button variant={"contained"}
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        setInfoAlertContainer(!infoAlertContainer);
                                                                    }}
                                                                    color="info" size="small">
                                                                {t('error.see-all')}
                                                            </Button>
                                                        }
                                                        sx={{
                                                            marginBottom: 1
                                                        }}
                                                        severity="info">
                                                        <Box onClick={(event) => {
                                                            event.stopPropagation();
                                                            setInfoAlertContainer(!infoAlertContainer);
                                                        }}>
                                                            <AlertTitle>{t("error.info-title")}</AlertTitle>
                                                            {t("error.loading-error")} — <strong>{` ${infoDuplication.length} ${t("error.warning-insert")} , ${t("error.re-duplicate")}`}</strong>
                                                        </Box>
                                                        <Collapse in={infoAlertContainer} timeout="auto" unmountOnExit>
                                                            <List>
                                                                {infoDuplication.map((info: any, index: number) => (
                                                                    <ListItem
                                                                        key={info.key}
                                                                        disableGutters
                                                                        secondaryAction={
                                                                            <Button variant={"contained"}
                                                                                    sx={{
                                                                                        visibility: !info.fixed ? "visible" : "hidden"
                                                                                    }}
                                                                                    onClick={(event) => {
                                                                                        event.stopPropagation();
                                                                                        console.log(info)
                                                                                        dispatch(onOpenPatientDrawer({patientId: info?.data && info?.data.uuid}));
                                                                                        setPatientDetailDrawer(true);
                                                                                    }}
                                                                                    color="warning" size="small">
                                                                                {t('error.see-details')}
                                                                            </Button>
                                                                        }>
                                                                        <strong>{index} .</strong>
                                                                        <ListItemText sx={{
                                                                            textDecorationLine: info.fixed ? "line-through" : "none"
                                                                        }}
                                                                                      primary={`${t("error.warning-row")} ${info.data?.firstName} ${info.data?.lastName} ${t("error.warning-row-detail")}`}/>
                                                                    </ListItem>))}
                                                            </List>
                                                        </Collapse>
                                                    </Alert>}
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
