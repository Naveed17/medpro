import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import { SubHeader } from "@features/subHeader";
import {RootStyled} from "@features/toolbar/components/calendarToolbar";
import {useTranslation} from "next-i18next";
import { Box } from "@mui/material";
import {DashLayout} from "@features/base";
import {Otable} from "@features/table";

function Agenda() {

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

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: t('agenda.name'),
            align: 'left',
            sortable: true,
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: t('agenda.type'),
            align: 'center',
            sortable: true
        },
        {
            id: 'speciality',
            numeric: false,
            disablePadding: false,
            label: t('agenda.speciality'),
            align: 'center',
            sortable: true
        },
        {
            id: 'place',
            numeric: true,
            disablePadding: false,
            label: t('agenda.place'),
            align: 'center',
            sortable: true
        },
        {
            id: 'nbAccess',
            numeric: true,
            disablePadding: false,
            label: t('agenda.nbAccess'),
            align: 'center',
            sortable: false
        },
        {
            id: 'actif',
            numeric: false,
            disablePadding: false,
            label: t('agenda.actif'),
            align: 'center',
            sortable: false
        },
        {
            id: 'public',
            numeric: false,
            disablePadding: false,
            label: t('agenda.public'),
            align: 'center',
            sortable: false
        },
        {
            id: 'action',
            numeric: false,
            disablePadding: false,
            label: t('motif.action'),
            align: 'center',
            sortable: false
        },
    ];

    return (<>
        <SubHeader>
            <RootStyled>
                <p style={{margin: 0}}>{t('agenda.path')}</p>
            </RootStyled>
        </SubHeader>

        <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
            <Otable headers={headCells}
                    rows={rows}
                    state={null}
                    from={'agenda'}
                    t={t}
                    edit={null}
                    handleConfig={null}
                    handleChange={null}/>
        </Box>

    </>)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
    }
})

export default Agenda
Agenda.auth = true;

Agenda.getLayout = function getLayout(page: ReactElement) {
     return (
         <DashLayout>
             {page}
         </DashLayout>
     )
}
