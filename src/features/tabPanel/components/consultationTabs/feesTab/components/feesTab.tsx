import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    InputAdornment,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TextField,
    Typography
} from "@mui/material";
import {Otable, TableRowStyled} from "@features/table";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import InputBaseStyled from "@features/table/components/overrides/inputBaseStyled";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment/moment";
import IconUrl from "@themes/urlIcon";
import {SubFooter} from "@features/subFooter";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

function FeesTab({...props}) {

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const [search, setSearch] = useState<string>("");
    const [selected, setSelected] = useState(false);

    interface HeadCell {
        disablePadding: boolean;
        id: string;
        label: string;
        numeric: boolean;
        sortable: boolean;
        align: "left" | "right" | "center";
    }

    const headCells: readonly HeadCell[] = [
        {
            id: "select",
            numeric: false,
            disablePadding: true,
            label: "#",
            sortable: false,
            align: "left",
        },
        {
            id: "acts",
            numeric: false,
            disablePadding: true,
            label: "title",
            sortable: true,
            align: "left",
        },
        {
            id: "qte",
            numeric: true,
            disablePadding: true,
            label: "quality",
            sortable: true,
            align: "right",
        },
        {
            id: "amount",
            numeric: true,
            disablePadding: false,
            label: "amount",
            sortable: true,
            align: "right",
        },
        {
            id: "total",
            numeric: true,
            disablePadding: false,
            label: "total",
            sortable: true,
            align: "center",
        },

    ];

    const {
        acts,
        selectedUuid,
        selectedAct,
        editAct,
        setTotal,
        setConsultationFees,
        consultationFees,
        free, setFree,
        patient, isHistory, router,
        total, setInfo, setState, setOpenDialog,
        t
    } = props;

    useEffect(() => {
        const localConsultationFees = localStorage.getItem("consultation-fees");
        if (localConsultationFees) {
            setConsultationFees(localConsultationFees);
        }
    })

    return (
        <>
            <Box>
                <Stack alignItems={"flex-end"} mb={2}>
                    <TextField
                        placeholder={t("exempleFees")}
                        value={search}
                        onChange={(ev) => {
                            setSearch(ev.target.value);
                        }}
                        sx={{width: '15rem'}}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <SearchIcon/>
                            </InputAdornment>,
                        }}
                    />
                </Stack>
                <Otable
                    headers={headCells}
                    rows={[]}
                    from={"CIP-medical-procedures"}
                    t={t}/>

                <TableContainer sx={{mt: -2}}>
                    <Table
                        stickyHeader
                        aria-labelledby="tableTitle"
                        size={"medium"}>
                        <TableBody>
                            <TableRowStyled
                                className={'cip-medical-proce-row'}
                                hover
                                tabIndex={-1}
                                key={Math.random()}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        onChange={(ev) => setFree(!ev.target.checked)}
                                        checked={!free}/>
                                </TableCell>
                                <TableCell>
                                    <Typography>Consultation</Typography>
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell>

                                </TableCell>
                                <TableCell align={"right"}>
                                    {free ? <Typography pr={3} color={"gray"}
                                                        fontSize={12}>{consultationFees} {devise}</Typography> :
                                        <Stack pr={3} direction={"row"} alignItems={"center"} justifyContent={"end"}>
                                            <InputBaseStyled
                                                size="small"
                                                value={consultationFees}
                                                type={"number"}
                                                placeholder={'--'}
                                                onFocus={() => {
                                                    setSelected(true);
                                                }}
                                                onBlur={() => {
                                                    setSelected(false);
                                                }}
                                                autoFocus={selected}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(ev) => {
                                                    setConsultationFees(Number(ev.target.value))
                                                    localStorage.setItem("consultation-fees", Number(ev.target.value).toString());
                                                }}
                                            />
                                            <Typography color={"gray"} fontSize={12}>{devise}</Typography>
                                        </Stack>}
                                </TableCell>
                            </TableRowStyled>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{marginTop: '-7px'}}>
                    <Otable
                        headers={[]}
                        rows={acts?.filter((act: any) => {
                            return act.act.name.toLowerCase().includes(search.toLowerCase())
                        })}
                        select={selectedUuid}
                        from={"CIP-medical-procedures"}
                        t={t}
                        edit={editAct}
                        handleChange={setTotal}/>
                </Box>

                <Button
                    onClick={() => {
                        router.push("/dashboard/settings/actfees")
                    }}
                    size="small"
                    startIcon={<TuneRoundedIcon/>}>
                    {t('consultationIP.config')}
                </Button>
            </Box>
            {/*<Stack spacing={2} display={{xs: "block", md: 'none'}}>
                {
                    acts?.map((data: any, index: number) => (
                        <React.Fragment key={`cip-card-${index}`}>
                            <CipMedicProCard row={data} t={t}/>
                        </React.Fragment>
                    ))
                }

            </Stack>*/}

            {/*            <Button
                onClick={() => setOpenActDialog(true)}
                size='small' sx={{
                '& .react-svg svg': {
                    width: theme => theme.spacing(1.5),
                    path: {fill: theme => theme.palette.primary.main}
                }
            }} startIcon={<IconUrl path="ic-plus"/>}>{t("consultationIP.add_a_new_act")}</Button>*/}


            <Box pt={8}/>

            <SubFooter>
                <Stack direction="row" alignItems={"center"}>
                    <Typography variant="subtitle1">
                        <span>{t("total")} : </span>
                    </Typography>
                    <Typography fontWeight={600} variant="h6" ml={1} mr={1}>
                        {isNaN(total) ? "-" : total} {devise}
                    </Typography>
                    {isHistory && <Stack
                        direction="row"
                        alignItems="center"
                        display={{xs: "none", md: "block"}}
                        spacing={2}>
                        <span>|</span>
                        <Button
                            variant="text-black"
                            onClick={(event) => {
                                let type = "";
                                if (!(patient.birthdate && moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                                    type = patient.gender === "F" ? "Mme " : patient.gender === "U" ? "" : "Mr "

                                event.stopPropagation();
                                setInfo("document_detail");
                                setState({
                                    type: "fees",
                                    name: "note_fees",
                                    info: selectedAct,
                                    createdAt: moment().format("DD/MM/YYYY"),
                                    consultationFees: free ? 0 : consultationFees,
                                    patient: `${type} ${patient.firstName} ${patient.lastName}`,
                                });
                                setOpenDialog(true);
                            }}
                            startIcon={<IconUrl path="ic-imprime"/>}>
                            {t("consultationIP.print")}
                        </Button>
                    </Stack>}
                </Stack>
            </SubFooter>

        </>
    );
}

export default FeesTab;
