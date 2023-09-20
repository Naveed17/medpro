import React, {useEffect, useState} from "react";
import {Box, InputAdornment, Stack, TextField} from "@mui/material";
import {Otable} from "@features/table";
import SearchIcon from "@mui/icons-material/Search";
import {useRequest, useRequestMutation} from "@lib/axios";

function FeesTab({...props}) {

    const [search, setSearch] = useState<string>("");

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
        mpActs,
        total,
        setTotal,
        status = null,
        agenda,
        urlMedicalEntitySuffix,
        app_uuid,
        devise,
        t,
        router,
        isQuoteRequest
    } = props;

    const {trigger} = useRequestMutation(null, "edit/fees");

    const {data: httpAppointmentFees} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda}/appointments/${app_uuid}/acts/${router.locale}`
    });

    const res = (httpAppointmentFees as HttpResponse)?.data
    useEffect(() => {
        if (res) {
            let _acts = [{
                act: {name: res.type.name},
                fees: res.consultation_fees ? Number(res.consultation_fees) : res.type.price,
                isTopAct: false,
                qte: 1,
                selected: status && status === 5 ? res.consultation_fees !== null : !res.type.isFree,
                uuid: "consultation_type"
            }, ...mpActs]

            res.acts && res.acts.map((act: { act_uuid: string; }) => {
                const index = _acts.findIndex(mpact => mpact.uuid === act.act_uuid)
                index > -1 ? _acts[index].selected = true : console.log(act)
            })
            setActs(_acts)
        }
    }, [res]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let _total = 0
        acts.filter((act: { selected: boolean; }) => act.selected).forEach((act: {
            fees: number;
            qte: number;
        }) => _total += act.fees * act.qte)
        setTotal(_total);
        saveChanges(_total);
    }, [acts, setTotal]) // eslint-disable-line react-hooks/exhaustive-deps

    const saveChanges = (_total: number) => {
        const _acts: { act_uuid: string; name: string; qte: number; price: number; }[] = [];

        acts.filter((act: {
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

        const app_type = acts.find((act: { uuid: string; }) => act.uuid === 'consultation_type')
        let isFree = true;
        let consultationFees = 0;

        if (app_type) {
            isFree = !app_type?.selected;
            consultationFees = app_type?.fees
        }

        const form = new FormData();
        form.append("acts", JSON.stringify(_acts));
        form.append("fees", _total.toString());
        if (!isFree)
            form.append("consultation_fees", consultationFees ? consultationFees.toString() : '0');

        trigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/data/${router.locale}`,
            data: form
        })
    }
    const editAct = (row: any, from: any) => {
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

                <Otable
                    headers={headCells}
                    rows={acts?.filter((act: any) => {
                        return act.act.name?.toLowerCase().includes(search.toLowerCase())
                    })}
                    from={"CIP-medical-procedures"}
                    t={t}
                    edit={editAct}
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
            </Box>

            <Box pt={8}/>
        </>
    );
}

export default FeesTab;
