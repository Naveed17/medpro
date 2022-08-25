import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import { DashLayout } from "@features/base";
import { Button, Box, Drawer, useMediaQuery } from "@mui/material";
import { RootStyled } from "@features/toolbar";
import { configSelector } from "@features/base";
import { SubHeader } from "@features/subHeader";
import { useAppSelector } from "@app/redux/hooks";
import { Otable } from "@features/table";
import { PfTemplateDetail } from "@features/pfTemplateDetail";
import AddIcon from '@mui/icons-material/Add';
function PatientFileTemplates() {
    const isMobile = useMediaQuery("(max-width:669px)");
    const { direction } = useAppSelector(configSelector);
    const [state, setState] = useState({
        active: true,
    });
    const [action, setAction] = useState('');
    const [data, setData] = useState(null);
    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: "name",
            align: 'left',
            sortable: true,
        },
        {
            id: 'active',
            numeric: false,
            disablePadding: false,
            label: 'active',
            align: 'center',
            sortable: false
        },
        {
            id: 'action',
            numeric: false,
            disablePadding: false,
            label: 'action',
            align: 'right',
            sortable: false
        },
    ];
    const [rows, setRows] = useState([
        { uuid: '1', name: 'Modele 1', isActive: true, color: '#FEBD15' },
        { uuid: '2', name: 'Modele 2', isActive: true, color: '#FF9070' },
        { uuid: '3', name: 'Modele 3', isActive: true, color: '#DF607B' },
        { uuid: '4', name: 'Modele 4', isActive: true, color: '#9A5E8A' },
        { uuid: '5', name: 'Modele 5', isActive: true, color: '#526686' },
        { uuid: '6', name: 'Modele 6', isActive: true, color: '#96B9E8' },
        { uuid: '7', name: 'Modele 7', isActive: true, color: '#72D0BE' },
        { uuid: '8', name: 'Modele 8', isActive: true, color: '#56A97F' }
    ]);
    const [open, setOpen] = useState(false);

    const handleChange = (props: any, event: string, value: string) => {
        console.log('handleChange', props);
        props.isActive = !props.isActive;
        setState({ ...state });

    }
    const handleEdit = (props: any, event: string, value: string) => {
        console.log(event, props);
        setOpen(true);
        setAction(event);
        setData(props);
    }

    const closeDraw = () => {
        setOpen(false);
    }

    const { t, ready } = useTranslation('settings', {
        keyPrefix: "templates.config",
    });
    if (!ready) return (<>loading translations...</>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{ margin: 0 }}>{t('path')}</p>
                </RootStyled>

                <Button type='submit'
                    variant="contained"
                    onClick={() => {
                        setOpen(true);
                        setData(null);
                        setAction('add');
                    }}
                    color="success">
                    {!isMobile ? t('add') : <AddIcon />}
                </Button>
            </SubHeader>
            <Box bgcolor={theme => theme.palette.background.default}
                sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>

                <Otable headers={headCells}
                    rows={rows}
                    state={state}
                    from={'template'}
                    t={t}
                    edit={handleEdit}
                    handleConfig={null}
                    handleChange={handleChange} />

                <Drawer
                    anchor={'right'}
                    open={open}
                    dir={direction}
                    onClose={closeDraw}>
                    <PfTemplateDetail action={action} data={data}></PfTemplateDetail>
                </Drawer>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'settings']))
    }
})
export default PatientFileTemplates

PatientFileTemplates.auth = true;

PatientFileTemplates.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
