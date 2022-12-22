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
import {useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

function ImportDataRow({...props}) {
    const {
        row, loading = false, t, handleEvent, data
    } = props;
    const {setPatientDetailDrawer, setDuplicatedData, setDuplicateDetectedDialog} = data;
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: triggerImportDataDetail} = useRequestMutation(null, "/import/data/detail");

    const [infoDuplication, setInfoDuplication] = useState<Array<{
        key: string;
        row: string;
        data: PatientModel | null;
        fixed: boolean;
    }>>([]);
    const [warningAlertContainer, setWarningAlertContainer] = useState(false);
    const [infoAlertContainer, setInfoAlertContainer] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [expandData, setExpandData] = useState([]);
    const [expandType, setExpandType] = useState("");
    const [loadingAction, setLoadingAction] = useState<boolean>(false);

    const getDetailImportData = (uuid: string, type: string) => {
        setExpandType(type);
        triggerImportDataDetail({
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/import/data/${uuid}/${type}/${router.locale}?page=1&limit=10`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then((value: any) => {
            if (value?.data.status === 'success') {
                setExpandData(value?.data.data);
            }
        });
    }

    return (
        <>
            <TableRowStyled
                sx={{
                    "&.MuiTableRow-root:hover": {
                        background: (theme: Theme) => theme.palette.background.paper
                    }
                }}
                onClick={() => {
                    if (expanded) {
                        setExpanded(!expanded);
                    }
                }}
                key={uniqueId}>
                <TableCell>
                    {row ? (
                        <Stack direction={"row"} alignItems={"center"}>
                            {(row.errors !== 0 || row.duplication !== 0 || row.info !== 0) &&
                                (expanded ? <RemoveIcon className={"expand-icon"}/> :
                                    <AddIcon className={"expand-icon"}/>)}
                            <Typography variant="body1" color="text.primary">
                                {row.date}
                            </Typography>

                            {row.errors > 0 &&
                                <Chip
                                    onClick={() => {
                                        if (!expanded) {
                                            getDetailImportData(row.uuid, "2");
                                        }
                                        setExpanded(!expanded);
                                    }}
                                    sx={{marginLeft: 1, height: 26}}
                                    color={"error"}
                                    icon={<IconUrl color={"black"} path={"danger"}/>}
                                    label={`${row.errors} ${t("error.title")}`}/>}

                            {row.duplication > 0 &&
                                <Chip
                                    onClick={() => {
                                        if (!expanded) {
                                            getDetailImportData(row.uuid, "1");
                                        }
                                        setExpanded(!expanded);
                                    }}
                                    sx={{marginLeft: 1, height: 26}}
                                    color={"warning"}
                                    icon={<ErrorIcon/>}
                                    label={`${row.duplication} ${t("error.warning-title")}`}/>}

                            {row.info > 0 &&
                                <Chip
                                    onClick={() => {
                                        if (!expanded) {
                                            getDetailImportData(row.uuid, "3");
                                        }
                                        setExpanded(!expanded);
                                    }}
                                    sx={{marginLeft: 1, height: 26}}
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
                            {(() => {
                                switch (row.method) {
                                    case 'med-win':
                                        return <Box m={"auto"} width={44} height={14} component="img"
                                                    src={"/static/img/logo-wide.png"}/>
                                    case 'med-pro':
                                        return <IconUrl className={"source-icon"} width={"20"} height={"20"}
                                                        path={"Med-logo_"}/>
                                    case 'med-link':
                                        return <IconUrl className={"source-icon"} width={"20"} height={"20"}
                                                        path={"ic-upload"}/>
                                }
                            })()}
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
            {expandType.length > 0 &&
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
                                <TableRow hover
                                          role="checkbox"
                                          className="collapse-row"
                                          sx={{
                                              "&.MuiTableRow-root": {
                                                  background: (theme: Theme) => theme.palette.common.white,
                                                  "&:hover": {
                                                      background: (theme: Theme) => theme.palette.background.paper
                                                  }
                                              }
                                          }}>
                                    <TableCell
                                        style={{backgroundColor: 'transparent', border: 'none', width: "auto"}}
                                        padding="checkbox">
                                        {loading ? (
                                            <Skeleton variant="circular" width={28} height={28}/>
                                        ) : (
                                            <>
                                                {expandType === "2" && <Alert
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
                                                {expandType === "1" && <Alert
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
                                                        {t("error.loading-error")} — <strong>{` ${row.duplication} ${t("error.duplicated")} , ${t("error.re-duplicate")}`}</strong>
                                                    </Box>
                                                    <Collapse in={warningAlertContainer} timeout="auto"
                                                              unmountOnExit>
                                                        <List>
                                                            {expandData.map((error: any, index: number) => (
                                                                <ListItem
                                                                    key={index}
                                                                    disableGutters
                                                                    secondaryAction={
                                                                        <Button variant={"contained"}
                                                                                sx={{
                                                                                    visibility: !error.fixed ? "visible" : "hidden"
                                                                                }}
                                                                                onClick={(event) => {
                                                                                    console.log(error)
                                                                                    event.stopPropagation();
                                                                                    setDuplicatedData(error.value);
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
                                                {expandType === "3" && <Alert
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
                                                        {t("error.loading-error")} — <strong>{` ${row.info} ${t("error.warning-insert")} , ${t("error.re-duplicate")}`}</strong>
                                                    </Box>
                                                    <Collapse in={infoAlertContainer} timeout="auto" unmountOnExit>
                                                        <List>
                                                            {expandData.map((info: any, index: number) => (
                                                                <ListItem
                                                                    key={index}
                                                                    disableGutters
                                                                    secondaryAction={
                                                                        <Button variant={"contained"}
                                                                                sx={{
                                                                                    visibility: !info.fixed ? "visible" : "hidden"
                                                                                }}
                                                                                onClick={(event) => {
                                                                                    event.stopPropagation();
                                                                                    console.log(info)
                                                                                    dispatch(onOpenPatientDrawer({patientId: info?.patient}));
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
