import React, {useEffect} from "react";
import {Box, Checkbox, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import {Otable} from "@features/table";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@app/constants";

function FeesTab({...props}) {

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

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
        selectedAct,
        editAct,
        setTotal,
        setConsultationFees,
        consultationFees,
        free, setFree,
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
            <Stack direction={"row"} alignItems={"center"}
                   style={{
                       background: "white",
                       padding: '10px 15px',
                       borderRadius: 10
                   }} spacing={2} mb={2}>
                <Checkbox
                    color="primary"
                    onChange={(ev) => setFree(!ev.target.checked)}
                    checked={!free}/>
                <Typography>Consultation</Typography>
                <TextField id="outlined-basic"
                           value={consultationFees}
                           size="small"
                           InputProps={{
                               endAdornment: <InputAdornment
                                   position="end">{devise}</InputAdornment>,
                               style: {width: 120, backgroundColor: "white"}
                           }}
                           onChange={(ev) => {
                               setConsultationFees(Number(ev.target.value))
                               localStorage.setItem("consultation-fees", ev.target.value);
                           }}
                           variant="outlined"/>
            </Stack>

            <Box>
                <Otable
                    headers={headCells}
                    rows={acts}
                    select={selectedUuid}
                    from={"CIP-medical-procedures"}
                    t={t}
                    edit={editAct}
                    handleChange={setTotal}/>
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
        </>
    );
}

export default FeesTab;
