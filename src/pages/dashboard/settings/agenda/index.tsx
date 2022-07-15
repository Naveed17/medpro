import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {useTranslation} from "next-i18next";
import {Box, Button, DialogActions} from "@mui/material";
import {configSelector, DashLayout} from "@features/base";
import {Otable} from "@features/table";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {useAppSelector} from "@app/redux/hooks";

function Agenda() {

    const [selected, setSelected] = useState<MedicalEntityLocationModel>();
    const [open, setOpen] = useState(false);

    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Praticien agenda',
            type: 'Praticien',
            speciality: "ORL",
            place: "Cabinet",
            nbAcces: 3,
            actif: true,
            public: true,
        },
        {
            id: 2,
            name: 'Salle radiologue',
            type: 'Salle',
            speciality: "ORL",
            place: "Radiologist",
            nbAcces: 3,
            actif: true,
            public: false,
        },
        {
            id: 3,
            name: 'Calendar assistant',
            type: 'Assistant',
            speciality: "Cardiologue",
            place: "Cabinet",
            nbAcces: 2,
            actif: false,
            public: true,
        }
    ])

    const {direction} = useAppSelector(configSelector);

    const dialogClose = () => {
        setOpen(false);
    };

    const dialogSave = () => {
        setOpen(false);
    }

    const {t, ready} = useTranslation("settings", {
        keyPrefix: "agenda.config",
    });
    if (!ready) return <>loading translations...</>;

    const headCells = [
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "name",
            align: "left",
            sortable: true,
        },
        {
            id: "type",
            numeric: false,
            disablePadding: false,
            label: "type",
            align: "center",
            sortable: true,
        },
        {
            id: "speciality",
            numeric: false,
            disablePadding: false,
            label: "speciality",
            align: "center",
            sortable: true,
        },
        {
            id: "place",
            numeric: true,
            disablePadding: false,
            label: "place",
            align: "center",
            sortable: true,
        },
        {
            id: "nbAccess",
            numeric: true,
            disablePadding: false,
            label: "nbAccess",
            align: "center",
            sortable: false,
        },
        {
            id: "actif",
            numeric: false,
            disablePadding: false,
            label: "actif",
            align: "center",
            sortable: false,
        },
        {
            id: "public",
            numeric: false,
            disablePadding: false,
            label: "public",
            align: "center",
            sortable: false,
        },
        {
            id: "action",
            numeric: false,
            disablePadding: false,
            label: "action",
            align: "center",
            sortable: false,
        },
    ];

    const handleChange = (props: any, e: any) =>{
        console.log(props)
        console.log(e);
    }
    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>
            </SubHeader>

            <Box className="container">
                <Otable
                    headers={headCells}
                    rows={rows}
                    state={null}
                    from={"agenda"}
                    t={t}
                    edit={null}
                    handleChange={handleChange}
                />
            </Box>

            <Dialog action={""}
                    open={open}
                    data={selected}
                    direction={direction}
                    color={'#E83B68'}
                    title={"Supprimer une agenda"}
                    t={t}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={dialogClose}
                                    startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                            <Button variant="contained"
                                    sx={{backgroundColor: '#E83B68'}}
                                    onClick={dialogSave}>{t('table.remove')}</Button>
                        </DialogActions>
                    }
            />
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, [
            "common",
            "menu",
            "settings",
        ])),
    },
});

export default Agenda;
Agenda.auth = true;

Agenda.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
