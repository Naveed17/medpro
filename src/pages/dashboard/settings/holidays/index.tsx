import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import { SubHeader } from "@features/subHeader";
import {RootStyled} from "@features/calendarToolbar";
import {useTranslation} from "next-i18next";
import {Box, Button, Drawer} from "@mui/material";
import {configSelector, DashLayout} from "@features/base";
import {Otable} from "@features/table";
import {useAppSelector} from "@app/redux/hooks";
import {HolidayDetails} from "@features/holidayDetails";

function Holidays() {

    const {direction} = useAppSelector(configSelector);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Congés',
            start: 'Fri April 10',
            time_start:'14:30',
            end: 'Fri April 10',
            time_end: '14:30',
            praticien: "Dr Omar OUNELLI"
        },
    ]);

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);


    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: t('holidays.name'),
            align: 'left',
            sortable: true,
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: t('holidays.start'),
            align: 'center',
            sortable: true
        },
        {
            id: 'speciality',
            numeric: false,
            disablePadding: false,
            label: t('holidays.end'),
            align: 'center',
            sortable: true
        },
        {
            id: 'place',
            numeric: true,
            disablePadding: false,
            label: t('holidays.praticien'),
            align: 'center',
            sortable: true
        },
        {
            id: 'action',
            numeric: false,
            disablePadding: false,
            label: t('holidays.action'),
            align: 'center',
            sortable: false
        },
    ];

    return (<>
        <SubHeader>
            <RootStyled>
                <p style={{margin: 0}}>{t('holidays.path')}</p>
            </RootStyled>

            <Button type='submit'
                    variant="contained"
                    onClick={() => {
                        setOpen(true);
                    }}
                    color="success">
                {t('lieux.add')}
            </Button>
        </SubHeader>

        <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
            <Otable headers={headCells}
                    rows={rows}
                    state={null}
                    from={'holidays'}
                    t={t}
                    edit={null}
                    handleConfig={null}
                    handleChange={null}/>

            <Drawer
                anchor={'right'}
                open={open}
                dir={direction}
                onClose={()=>{setOpen(false)}}>
                <HolidayDetails/>
            </Drawer>
        </Box>

    </>)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
    }
})

export default Holidays
Holidays.auth = true;

Holidays.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}