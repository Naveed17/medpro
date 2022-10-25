import React from "react";
import {Box, Button, Stack, Typography} from "@mui/material";
import {Otable} from "@features/table";
import {CipMedicProCard} from "@features/card";
import IconUrl from "@themes/urlIcon";
import {SubFooter} from "@features/subFooter";

function FeesTab({...props}) {

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
            label: "acts",
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
            align: "left",
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
        setInfo,
        setState,
        patient,
        editAct,
        selectedAct,
        setTotal,
        setOpenActDialog,
        setOpenDialog,
        total,
        t
    } = props
    return (
        <>
            <Box display={{xs: 'none', md: 'block'}}>
                <Otable
                    headers={headCells}
                    rows={acts}
                    select={selectedUuid}
                    from={"CIP-medical-procedures"}
                    t={t}
                    edit={editAct}
                    handleConfig={null}
                    handleChange={setTotal}/>
            </Box>
            <Stack spacing={2} display={{xs: "block", md: 'none'}}>
                {
                    acts?.map((data: any, index: number) => (
                        <React.Fragment key={`cip-card-${index}`}>
                            <CipMedicProCard row={data} t={t}/>
                        </React.Fragment>
                    ))
                }

            </Stack>

{/*            <Button
                onClick={() => setOpenActDialog(true)}
                size='small' sx={{
                '& .react-svg svg': {
                    width: theme => theme.spacing(1.5),
                    path: {fill: theme => theme.palette.primary.main}
                }
            }} startIcon={<IconUrl path="ic-plus"/>}>{t("consultationIP.add_a_new_act")}</Button>*/}
            <Box pt={8}/>
        </>
    );
}

export default FeesTab;
