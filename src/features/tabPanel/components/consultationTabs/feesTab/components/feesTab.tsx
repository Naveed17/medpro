import React, {useEffect, useState} from "react";
import {Box, InputAdornment, Stack, TextField} from "@mui/material";
import {Otable} from "@features/table";
import SearchIcon from "@mui/icons-material/Search";
import {CipMedicProCard} from '@features/card'
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useRouter} from "next/router";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";

function FeesTab({...props}) {

    const [search, setSearch] = useState<string>("");

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
            id: "code",
            numeric: false,
            disablePadding: true,
            label: "code",
            sortable: true,
            align: "left",
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
            id: "amount",
            numeric: true,
            disablePadding: false,
            label: "amount",
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
        devise,
        editAct = null,
        t,
        mutatePatient,
        isQuoteRequest
    } = props;

    const router = useRouter();

    const {trigger: triggerFeesEdit} = useRequestQueryMutation("appointment/fees/edit");
    const {data: httpAppointmentFees, mutate} = useRequestQuery(app_uuid ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda}/appointments/${app_uuid}/acts/${router.locale}`
    } : null);

    const res = (httpAppointmentFees as HttpResponse)?.data;

    useEffect(() => {
        if (res) {
            let _acts = [{
                act: {name: res.type.name},
                fees: res.consultation_fees && res.consultation_fees !== "null" ? Number(res.consultation_fees) : res.type.price,
                isTopAct: false,
                qte: 1,
                selected: res.consultation_fees !== null && res.consultation_fees !== "null",
                uuid: "consultation_type"
            }, ...mpActs]

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

        const app_type = actsList.find((act: { uuid: string; }) => act.uuid === 'consultation_type')
        let isFree = true;
        let consultationFees = 0;

        if (app_type) {
            isFree = !app_type?.selected;
            consultationFees = isFree ? null : app_type?.fees
        }

        const form = new FormData();
        form.append("acts", JSON.stringify(_acts));
        form.append("fees", _total.toString());
        form.append("consultation_fees", consultationFees ? consultationFees.toString() : "null");

        app_uuid && triggerFeesEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda}/appointments/${app_uuid}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutatePatient()
                mutate()
            }
        });
    }

    const editActConsult = (row: any, from: any) => {
        const act_index = acts.findIndex((act: { uuid: any; }) => act.uuid === row.uuid)
        if (from === 'check')
            acts[act_index].selected = !acts[act_index].selected

        if (from === 'change')
            acts[act_index] = row

        saveChanges([...acts]);

    }

    return (
        <>
            <Box>
                {!isQuoteRequest && <Stack alignItems={"flex-end"} mb={2}>
                    <TextField
                        placeholder={t("exempleFees")}
                        value={search}
                        onChange={(ev) => {
                            setSearch(ev.target.value);
                        }}
                        sx={{width: '15rem'}}
                        inputProps={{style: {background: "white"}}}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <SearchIcon/>
                            </InputAdornment>,
                        }}
                    />
                </Stack>}
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        rows={acts?.filter((act: any) => {
                            return act.act.name?.toLowerCase().includes(search.toLowerCase())
                        })}
                        from={"CIP-medical-procedures"}
                        t={t}
                        edit={editAct ? editAct : editActConsult}
                        devise={devise}
                        handleChange={setTotal}/>
                    {/* {!isQuoteRequest&&<Button
                    onClick={() => {
                        router.push("/dashboard/settings/actfees")
                    }}
                    size="small"
                    startIcon={<TuneRoundedIcon/>}>
                    {t('consultationIP.config')}
                </Button>}*/}
                </DesktopContainer>
                <MobileContainer>
                    {
                        <Stack spacing={2}>
                            {
                                acts?.filter((act: any) => {
                                    return act.act.name?.toLowerCase().includes(search.toLowerCase())
                                }).map((act: any) => (
                                    <React.Fragment key={act.uuid}>
                                        <CipMedicProCard row={act} devise={devise}
                                                         edit={editAct ? editAct : editActConsult}
                                        />
                                    </React.Fragment>
                                ))
                            }

                        </Stack>
                    }

                </MobileContainer>


            </Box>

            <Box pt={4}/>
        </>
    );
}

export default FeesTab;
