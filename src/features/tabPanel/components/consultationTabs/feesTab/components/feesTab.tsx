import React, {useEffect} from "react";
import {Box, Checkbox, Stack, Table, TableBody, TableCell, TableContainer, Typography} from "@mui/material";
import {Otable, TableRowStyled} from "@features/table";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@app/constants";
import InputBaseStyled from "@features/table/components/overrides/inputBaseStyled";

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
                <Otable
                    headers={headCells}
                    rows={[]}
                    from={"CIP-medical-procedures"}
                    t={t}/>

                <TableContainer sx={{mt:-2}}>
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
                                    {free ? <Typography pr={3} color={"gray"} fontSize={12}>{consultationFees} {devise}</Typography>:<Stack pr={3} direction={"row"} alignItems={"center"} justifyContent={"end"}>
                                        <InputBaseStyled
                                            size="small"
                                            value={consultationFees}
                                            placeholder={'--'}
                                            autoFocus={true}

                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(ev) => {
                                                setConsultationFees(Number(ev.target.value))
                                                localStorage.setItem("consultation-fees", ev.target.value);
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
                        rows={acts}
                        select={selectedUuid}
                        from={"CIP-medical-procedures"}
                        t={t}
                        edit={editAct}
                        handleChange={setTotal}/>
                </Box>
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
