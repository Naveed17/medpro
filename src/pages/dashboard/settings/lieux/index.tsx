import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import DashLayout from "@features/base/dashLayout";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/calendarToolbar";
import { Box, Button } from "@mui/material";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import MedTable from "@themes/overrides/MedTable";
const Maps = dynamic(() => import("@features/maps/components/maps"), { ssr: false });

function Lieux() {

    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Cabinet',
            actif: true,
            agenda: '2',
            cords: [36.814266, 10.181982]
        },
        {
            id: 2,
            name: 'Hopital',
            actif: false,
            agenda: '1',
            cords: [36.8364061,10.1611009]
        },
        {
            id: 3,
            name: 'Clinique',
            actif: true,
            agenda: '2',
            cords: [36.8438734,10.2195565]
        }
    ]);

    const cords = rows.filter(row => row.actif).map((v) => v);
    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: t('lieux.name'),
            align: 'left',
            sortable: true,
        },
        {
            id: 'actif',
            numeric: false,
            disablePadding: true,
            label: t('lieux.actif'),
            align: 'center',
            sortable: true,
        },
        {
            id: 'agenda',
            numeric: false,
            disablePadding: true,
            label: t('lieux.sharedCalander'),
            align: 'center',
            sortable: true,
        },
        {
            id: 'action',
            numeric: false,
            disablePadding: true,
            label: t('lieux.action'),
            align: 'center',
            sortable: true,
        },
    ];

    const editPlaces = (props: any) => {
        console.log('edit', props);
    }
    const handleConfig = (props: any, event: string) => {
        console.log('handleConfig', event);
    }

    const handleChange = (props: any, event: string, value: string) => {
        props.actif = !props.actif;
        setRows([...rows]);
    }

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('lieux.path')}</p>
                    <Button type='submit'
                            variant="contained"
                            onClick={() => {
                                console.log('add');
                            }}
                            color="success">
                        {t('lieux.add')}
                    </Button>
                </RootStyled>
            </SubHeader>
            <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <MedTable headers={headCells}
                          rows={rows}
                          state={null}
                          from={'lieux'}
                          t={t}
                          editMotif={editPlaces}
                          handleConfig={handleConfig}
                          handleChange={handleChange}/>
                <Maps data={cords}></Maps>
            </Box>
        </>)
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
    }
})
export default Lieux

Lieux.auth = true;

Lieux.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
