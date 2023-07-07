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
        editAct,
        setTotal,
        devise,
        router,
        t
    } = props;

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
                        rows={acts?.filter((act: any) => {
                            return act.act.name.toLowerCase().includes(search.toLowerCase())
                        })}
                        from={"CIP-medical-procedures"}
                        t={t}
                        edit={editAct}
                        devise={devise}
                        handleChange={setTotal}/>

                <Button
                    onClick={() => {
                        router.push("/dashboard/settings/actfees")
                    }}
                    size="small"
                    startIcon={<TuneRoundedIcon/>}>
                    {t('consultationIP.config')}
                </Button>
            </Box>

            <Box pt={8}/>
        </>
    );
}

export default FeesTab;
