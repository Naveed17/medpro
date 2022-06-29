import React, { ReactElement, useState } from "react";
import DashLayout from "@features/base/components/dashLayout/dashLayout";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SubHeader } from "@features/subHeader";
import { RootStyled } from "@features/calendarToolbar";
import { Box, Button, Drawer } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Otable } from "@features/table";
import { useAppSelector } from "@app/redux/hooks";
import { configSelector } from "@features/base";
import { SubstituteDetails } from "@features/substituteDetails";

function Subtitule() {

    const [edit, setEdit] = useState(false);
    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Rhouma BHA',
            email: 'rhoumabhat@mail.com',
            fonction: 'Practitioner',
            speciality: 'Dermatologist',
            status: 'En attente',
            bg: '#FFD400',
            color: '#000',
            access: '2',
        },
        {
            id: 2,
            name: 'Hassen Ounelli',
            email: 'houssemouelli@mail.com',
            fonction: 'Practitioner',
            speciality: 'Dermatologist',
            status: 'Accepté',
            bg: '#1BC47D',
            color: '#FFF',
            access: '1',
        },
        {
            id: 3,
            name: 'Sarra Bent',
            email: 'sarrabent@mail.com',
            fonction: 'Secretary',
            speciality: '',
            status: 'Accepté',
            bg: '#1BC47D',
            color: '#FFF',
            access: '2',
        },
    ]);
    const { direction } = useAppSelector(configSelector);

    const { t, ready } = useTranslation("settings", { keyPrefix: "substitute" });
    if (!ready) return (<>loading translations...</>);

    const closeDraw = () => {
        setEdit(false);
    }

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'name',
            align: 'left',
            sortable: true,
        },
        {
            id: 'fonction',
            numeric: false,
            disablePadding: false,
            label: 'fonction',
            align: 'center',
            sortable: true
        },
        {
            id: 'resquest',
            numeric: false,
            disablePadding: false,
            label: 'request',
            align: 'center',
            sortable: true
        },
        {
            id: 'access',
            numeric: true,
            disablePadding: false,
            label: 'access',
            align: 'center',
            sortable: true
        },
        {
            id: 'action',
            numeric: false,
            disablePadding: false,
            label: 'action',
            align: 'center',
            sortable: false
        },
    ];

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{ margin: 0 }}>{t('path')}</p>
                </RootStyled>

                <Button type='submit'
                    variant="contained"
                    onClick={() => {
                        setEdit(true);
                    }}
                    color="success">
                    {t('add')}
                </Button>
            </SubHeader>

            <Box bgcolor="#F0FAFF" sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>
                <Otable headers={headCells}
                    rows={rows}
                    state={null}
                    from={'substitute'}
                    t={t}
                    edit={null}
                    handleConfig={null}
                    handleChange={null} />

                <Drawer
                    anchor={'right'}
                    open={edit}
                    dir={direction}
                    onClose={closeDraw}>
                    <SubstituteDetails closeDraw={closeDraw} />
                </Drawer>

            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'settings']))
    }
})


export default Subtitule

Subtitule.auth = true;

Subtitule.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
