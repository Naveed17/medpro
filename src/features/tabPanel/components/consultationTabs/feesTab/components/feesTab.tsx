import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Collapse,
    IconButton,
    InputAdornment,
    LinearProgress,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {Otable} from "@features/table";
import {CipMedicProCard} from '@features/card'
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {getBirthdayFormat, useMutateOnGoing} from "@lib/hooks";
import IconUrl from "@themes/urlIcon";
import moment from "moment";

function FeesTab({...props}) {
    const router = useRouter();
    const theme = useTheme()
    const {trigger: mutateOnGoing} = useMutateOnGoing();

    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const headCells: readonly HeadCell[] = [
        {
            id: "select",
            numeric: false,
            disablePadding: true,
            label: "empty",
            sortable: false,
            align: "left",
        },
        {
            id: "acts",
            numeric: false,
            disablePadding: true,
            label: "acts",
            sortable: true,
            align: "left",
        },
        {
            id: "fees",
            numeric: false,
            disablePadding: true,
            label: "fees",
            sortable: true,
            align: "left",
        },

        {
            id: "amount",
            numeric: true,
            disablePadding: false,
            label: "reimb",
            sortable: true,
            align: "center",
        },
        {
            id: "contribution",
            numeric: false,
            disablePadding: true,
            label: "contribution",
            sortable: true,
            align: "left",
        },
        {
            id: "qte",
            numeric: true,
            disablePadding: true,
            label: "quality",
            sortable: true,
            align: "center",
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
        setActs,
        mpActs = [],
        setTotal,
        agenda,
        urlMedicalEntitySuffix,
        app_uuid,
        total,
        devise,
        editAct = null,
        t,
        mutatePatient,
        isQuoteRequest,
        setOpenDialogSave,
        patient,
        setInfo,
        setOpenDialog,
        setState
    } = props;

    const {trigger: triggerFeesEdit} = useRequestQueryMutation("appointment/fees/edit");
    const {data: httpAppointmentFees, mutate} = useRequestQuery(app_uuid ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda}/appointments/${app_uuid}/acts/${router.locale}`
    } : null);

    const res = (httpAppointmentFees as HttpResponse)?.data;

    useEffect(() => {
        if (isQuoteRequest)
            setLoading(false)
        if (res) {
            let _acts = [/*{
                act: {name: res.type.name},
                fees: res.consultation_fees && res.consultation_fees !== "null" ? Number(res.consultation_fees) : res.type.price,
                isTopAct: false,
                qte: 1,
                selected: res.consultation_fees !== null && res.consultation_fees !== "null",
                uuid: "consultation_type"
            },*/ ...mpActs]

            res.acts && res.acts.map((act: { act_uuid: string, qte: number, price: number }) => {
                const index = _acts.findIndex(mpact => mpact.uuid === act.act_uuid)
                if (index > -1) {
                    _acts[index].selected = true
                    _acts[index].qte = act.qte;
                    _acts[index].fees = act.price;
                }
            })

            let _total = 0
            _acts.filter((act: { selected: boolean; }) => act.selected).forEach((act: {
                fees: number;
                qte: number;
            }) => _total += act.fees * act.qte)
            setTotal(_total);

            setActs(_acts)
            setLoading(false)
        }
    }, [res]) // eslint-disable-line react-hooks/exhaustive-deps

    const saveChanges = (actsList: any[]) => {
        const _acts: { act_uuid: string; name: string; qte: number; price: number; }[] = [];

        let _total = 0
        actsList.filter((act: { selected: boolean; }) => act.selected).forEach((act: {
            fees: number;
            qte: number;
        }) => _total += act.fees * act.qte)
        setTotal(_total);

        actsList.filter((act: {
            selected: boolean;
            uuid: string;
        }) => act.selected && act.uuid !== "consultation_type").forEach((act: {
            uuid: string;
            act: { name: string; };
            qte: number;
            fees: number;
        }) => {
            _acts.push({
                act_uuid: act.uuid,
                name: act.act.name,
                qte: act.qte,
                price: act.fees,
            });
        })

       /* const app_type = actsList.find((act: { uuid: string; }) => act.uuid === 'consultation_type')
        let isFree = true;
        let consultationFees = 0;

        if (app_type) {
            isFree = !app_type?.selected;
            consultationFees = isFree ? null : app_type?.fees
        }*/

        const form = new FormData();
        form.append("acts", JSON.stringify(_acts));
        form.append("fees", _total.toString());
        //form.append("consultation_fees", consultationFees ? consultationFees.toString() : "null");

        app_uuid && triggerFeesEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda}/appointments/${app_uuid}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutateOnGoing();
                mutatePatient();
                mutate();
            }
        });
    }

    const editActConsult = (row: any, from: any) => {
        const act_index = acts.findIndex((act: { uuid: any; }) => act.uuid === row.uuid)
        if (from === 'check')
            acts[act_index].selected = !acts[act_index].selected

        if (from === 'change')
            acts[act_index] = row

        setActs([...acts])
    }

    return (
        <>
            <Box>

                <DesktopContainer>

                    <Card style={{height: "57vh"}}>
                        <CardContent style={{padding: 0}}>
                            <Stack direction='row' pt={1} pl={2} pr={2} alignItems={{xs: 'flex-start', md: 'center'}}
                                   justifyContent="space-between" mb={2} pb={1} borderBottom={1}
                                   borderColor='divider'>
                                <Typography fontWeight={700} mt={1} mb={1}>
                                    {t("service")}
                                </Typography>
                                <Stack direction={'row'} alignItems="center" spacing={1}>
                                    {!isQuoteRequest && <Stack direction={'row'} spacing={1} alignItems={"flex-end"}>
                                        <IconButton onClick={(event) => {
                                            setOpenDialogSave && setOpenDialogSave(true);
                                            let type = "";
                                            if (!(patient?.birthdate && moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                                                type = patient?.gender === "F" ? "Mme " : patient?.gender === "U" ? "" : "Mr "

                                            event.stopPropagation();
                                            setInfo("document_detail");
                                            setState({
                                                type: "fees",
                                                name: "Honoraire",
                                                info: acts.filter((act: { selected: boolean }) => act.selected),
                                                createdAt: moment().format("DD/MM/YYYY"),
                                                age: patient?.birthdate ? getBirthdayFormat({birthdate: patient.birthdate}, t) : "",
                                                patient: `${type} ${patient?.firstName} ${patient?.lastName}`,
                                            });
                                            setOpenDialog(true);

                                        }} style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: theme.palette.grey['A500']
                                        }}>
                                            <IconUrl width={16} height={16} path="menu/ic-print"/>
                                        </IconButton>
                                        {/*<Button variant="contained" startIcon={<Add/>}>
                                            {t("consultationIP.add_act")}
                                        </Button>*/}
                                    </Stack>}
                                </Stack>
                            </Stack>
                            {loading && <LinearProgress/>}
                            <Collapse in={!loading} style={{maxHeight: "47vh", overflow: "auto", padding: 0}}>

                                {!isQuoteRequest && <Stack pl={2} pr={2}>
                                    <TextField
                                        placeholder={t("exempleFees")}
                                        value={search}
                                        onChange={(ev) => {
                                            setSearch(ev.target.value);
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <IconUrl path={"ic-search"}/>
                                            </InputAdornment>,
                                        }}/>
                                </Stack>}
                                <Otable
                                    headers={headCells}
                                    rows={acts?.filter((act: any) => {
                                        return act.act.name?.toLowerCase().includes(search.toLowerCase())
                                    })}
                                    from={"CIP-medical-procedures"}
                                    t={t}
                                    edit={editAct ? editAct : editActConsult}
                                    handleEvent={() => {
                                        saveChanges([...acts])
                                    }}
                                    devise={devise}
                                    handleChange={setTotal}/>
                            </Collapse>

                        </CardContent>
                    </Card>
                    {!loading && !isQuoteRequest && (
                        <Stack direction='row' spacing={2} mt={2}>
                            <Card sx={{border: 'none', width: 1}}>
                                <CardContent>
                                    <Stack direction='row' alignItems='center' justifyContent='space-between' width={1}>
                                        <Typography variant="body2">
                                            {t("table.fees")}
                                        </Typography>
                                        <Typography fontWeight={700}>
                                            {acts.reduce((acc: number, curr: any) =>acc + (curr.selected ?Number(curr.fees):0), 0)} {devise}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card sx={{border: 'none', width: 1}}>
                                <CardContent>
                                    <Stack direction='row' alignItems='center' justifyContent='space-between' width={1}>
                                        <Typography variant="body2">
                                            {t("table.reimb")}
                                        </Typography>
                                        <Typography fontWeight={700}>
                                            {acts.reduce((acc: number, curr: any) => acc + (curr.selected ?Number(curr.contribution):0), 0)} {devise}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card sx={{border: 'none', width: 1}}>
                                <CardContent>
                                    <Stack direction='row' alignItems='center' justifyContent='space-between' width={1}>
                                        <Typography variant="body2">
                                            {t("table.total")}
                                        </Typography>
                                        <Typography fontWeight={700}>
                                            {isNaN(total) || total < 0 ? "-" : total} {devise}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    )}

                </DesktopContainer>
                <MobileContainer>
                    {
                        <Stack spacing={1}>
                            {
                                acts?.filter((act: any) => {
                                    return act.act.name?.toLowerCase().includes(search.toLowerCase())
                                }).map((act: any) => (
                                    <CipMedicProCard key={act.uuid}
                                                     row={act}
                                                     devise={devise}
                                                     edit={editAct ? editAct : editActConsult}
                                                     handleChange={setTotal}
                                                     t={t}
                                                     handleEvent={() => {
                                                         saveChanges([...acts])
                                                     }}/>
                                ))
                            }

                        </Stack>
                    }
                </MobileContainer>
            </Box>

            {isQuoteRequest && <Box pt={4}/>}
        </>
    );
}

export default FeesTab;
