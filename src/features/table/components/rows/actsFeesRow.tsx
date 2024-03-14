import TableCell from "@mui/material/TableCell";
import {
    IconButton,
    InputAdornment,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {Otable, TableRowStyled} from "@features/table";
import React, {useEffect, useState} from "react";
import IconUrl from "@themes/urlIcon";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";

const headCells: readonly HeadCell[] = [
    {
        id: "title",
        numeric: false,
        disablePadding: true,
        label: "title",
        sortable: true,
        align: "left",
    },
    {
        id: "type",
        numeric: true,
        disablePadding: false,
        label: "type",
        sortable: true,
        align: "center",
    },
    {
        id: "exp_date",
        numeric: true,
        disablePadding: false,
        label: "exp_date",
        sortable: true,
        align: "center",
    },
    {
        id: "mtt",
        numeric: true,
        disablePadding: false,
        label: "mtt",
        sortable: true,
        align: "center",
    },
    {
        id: "tax",
        numeric: true,
        disablePadding: false,
        label: "tax",
        sortable: true,
        align: "center",
    },
    {
        id: "remb",
        numeric: true,
        disablePadding: false,
        label: "remb",
        sortable: true,
        align: "center",
    },
    {
        id: "tax_remb",
        numeric: true,
        disablePadding: false,
        label: "tax_remb",
        sortable: true,
        align: "center",
    },
    {
        id: "actions",
        numeric: true,
        disablePadding: false,
        label: "actions",
        sortable: false,
        align: "right",
    },
];

function ActFeesRow({...props}) {
    const {row, editMotif, handleEvent, data, t} = props;
    const theme = useTheme()
    const isMobile = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("md")
    );
    const [fees, setFees] = useState("");
    const [contribution, setContribution] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [edit, setEdit] = useState("");
    const [collapse, setCollapse] = useState(false)

    useEffect(() => {
        setFees(row?.fees);
        setContribution(row?.contribution);
        setCode(row?.code);
        setName(row?.act?.name);
    }, [row]);

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    return (
        <>
            <TableRowStyled className="act-fees-row" {...(collapse && {
                                sx: {
                                    "& > .MuiTableCell-root": {

                                        "&:first-of-type": {
                                            borderBottomLeftRadius: '0 !important',
                                        },
                                        "&:last-of-type": {
                                            borderBottomRightRadius: '0 !important',

                                        }
                                    }
                                }
                            })}>
                <TableCell>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <IconButton
                            onClick={() => setCollapse(!collapse)}
                            sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: .7,
                                width: 27,
                                height: 27,

                            }}>
                            <IconUrl path="ic-expand"/>
                        </IconButton>
                        {edit === row?.uuid && !row?.act.isVerified ? (
                            <TextField
                                placeholder={"--"}
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    row.act.name = e.target.value;
                                }}
                            />
                        ) : (
                            <Tooltip title={row?.act?.name}>
                                <Typography fontWeight={500} className="ellipsis" width={200}>
                                    {row?.act?.name}
                                </Typography>
                            </Tooltip>
                        )}
                    </Stack>

                </TableCell>
                <TableCell align={"center"}>
                    {edit === row?.uuid ? (
                        <TextField
                            placeholder={"--"}
                            value={code}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setCode(e.target.value);
                                    row.code = e.target.value;
                                }
                            }}
                            InputProps={{
                                style: {width: isMobile ? 85 : 150, backgroundColor: "white"},
                                inputProps: {min: 0},
                            }}
                        />
                    ) : (
                        <Typography fontSize={14} letterSpacing={1}>
                            {row?.code ? row?.code : "--"}
                        </Typography>
                    )}
                </TableCell>
                <TableCell align={"center"}>
                    {edit === row?.uuid ? (
                        <TextField
                            placeholder={"--"}
                            value={contribution}
                            onChange={(e) => {
                                if (!isNaN(Number(e.target.value))) {
                                    setContribution(e.target.value);
                                    row.contribution = Number(e.target.value);
                                }
                            }}
                            InputProps={{
                                style: {width: isMobile ? 85 : 150, backgroundColor: "white"},
                                inputProps: {min: 0},
                            }}
                        />
                    ) : (
                        <Typography fontSize={14} letterSpacing={1}>
                            {row?.contribution ? row?.contribution : "--"}
                        </Typography>
                    )}
                </TableCell>
                <TableCell align={"center"}>
                    {edit === row?.uuid ? (
                        <TextField
                            placeholder={"--"}
                            value={fees}
                            onChange={(e) => {
                                if (!isNaN(Number(e.target.value))) {
                                    setFees(e.target.value);
                                    row.fees = Number(e.target.value);
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">{devise}</InputAdornment>
                                ),
                                style: {width: isMobile ? 85 : 150, backgroundColor: "white"},
                                inputProps: {min: 0},
                            }}
                        />
                    ) : (
                        <Typography color='secondary' fontWeight={700}>
                            {row?.fees} {devise}
                        </Typography>
                    )}
                </TableCell>
                <TableCell align="right">
                    {row ? (
                        <Stack direction='row' spacing={1} alignItems="center" justifyContent='flex-end'>
                            {edit === row.uuid ? (
                                <IconButton
                                    size="small"
                                    className="btn-edit"
                                    disabled={fees?.length === 0}
                                    color={"primary"}
                                    sx={{mr: {md: 1}}}
                                    onClick={() => {
                                        editMotif(row, fees, name, code, contribution);
                                        setTimeout(() => {
                                            setEdit("");
                                        }, 1000);
                                    }}>
                                    {!isMobile &&
                                        <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>}

                                    <Typography fontSize={11} ml={1}>
                                        {t("save")}
                                    </Typography>
                                </IconButton>
                            ) : !row.hasData && (
                                <IconButton
                                    size="small"
                                    className="btn-edit"
                                    sx={{mr: {md: 1}}}
                                    onClick={() => {
                                        setEdit(row.uuid);
                                    }}>
                                    <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                                </IconButton>
                            )}
                            {!row.hasData && <IconButton
                                onClick={() => {
                                    data.handleSelected(row);
                                }}
                                size="small"
                                sx={{
                                    mr: {md: 1},
                                    '& .react-svg svg': {
                                        width: 20,
                                        height: 20
                                    }
                                }}>
                                <IconUrl color={theme.palette.text.secondary} path="ic-trash"/>
                            </IconButton>}
                            {/*<Button
                        onClick={(e)=> handleEvent({row,event:e,action:'OPEN-AGREEMENT-DIALOG'})}
                        variant="outlined" color="info" className="btn-action" startIcon={<IconUrl path="ic-plus" width={12} height={12}/>}>
                            {t("table.btn_action_text")} ({10})
                        </Button>*/}
                            {/*<IconButton size="small"
                         onClick={(e)=> handleEvent({row,event:e,action:'OPEN-POPOVER'})}
                         className="btn-more"
                        >
                            <MoreVertIcon fontSize="small"/>

                            </IconButton>*/}
                        </Stack>
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
            {collapse && <TableRowStyled className="row-collapse">
                <TableCell colSpan={5}
                           style={{
                               backgroundColor: "none",
                               border: "none",
                               borderTop: "none",
                               borderBottom: "none",
                               lineHeight: 0,
                               padding: 0,
                           }}>
                    <Paper sx={{
                        bgcolor: theme.palette.background.default,
                        p: 1,
                        mt: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    }}>
                        <Otable
                            headers={headCells}
                            rows={[1, 2, 3]}
                            from={"actfees-collapse"}
                            {...{t, devise, handleEvent}}
                        />
                    </Paper>
                </TableCell>
            </TableRowStyled>}

        </>
    );
}

export default ActFeesRow;
