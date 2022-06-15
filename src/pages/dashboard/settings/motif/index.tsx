import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import DashLayout from "@features/base/dashLayout";
import MedTable from "@themes/overrides/MedTable"
import { Box, Button, Drawer } from "@mui/material";
import {useTranslation} from "next-i18next";
import { EditMotifDialog } from "@features/editMotifDialog";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/calendarToolbar";
import {configSelector} from "@features/setConfig";
import {useAppSelector} from "@app/redux/hooks";

function Motif() {
    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Mal de tête',
            color: 'success',
            agenda: 1,
            duree: '10',
            min: '1',
            max: '3',
            type: 'Tous',
            active: true
        },
        {
            id: 2,
            name: 'Motif x',
            color: 'primary',
            agenda: 2,
            duree: '20',
            min: '2',
            max: '2',
            type: 'Type2',
            active: false
        },
        {
            id: 3,
            name: 'Vertiges',
            color: 'error',
            agenda: 3,
            duree: '30',
            min: '3',
            max: '1',
            type: 'Type3',
            active: false
        },
    ]);
    const [edit, setEdit] = useState(false);
    const [state, setState] = useState({
        duration: false,
        delay_min: false,
        delay_max: true,
        active: false
    });
    const [selected, setSelected] = useState();
    const {direction} = useAppSelector(configSelector);

    const {t, ready} = useTranslation('settings');
    if (!ready) return (<>loading translations...</>);

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: t('motif.name'),
            align: 'left',
            sortable: true,
        },
        {
            id: 'duration',
            numeric: false,
            disablePadding: false,
            label: t('motif.duration'),
            align: 'left',
            sortable: false
        },
        {
            id: 'delay_min',
            numeric: false,
            disablePadding: false,
            label: t('motif.delay_min'),
            align: 'left',
            sortable: false
        },
        {
            id: 'delay_max',
            numeric: true,
            disablePadding: false,
            label: t('motif.delay_max'),
            align: 'left',
            sortable: false
        },
        {
            id: 'agenda',
            numeric: true,
            disablePadding: false,
            label: t('motif.agenda'),
            align: 'center',
            sortable: false
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: t('motif.type'),
            align: 'center',
            sortable: true
        },
        {
            id: 'active',
            numeric: false,
            disablePadding: false,
            label: t('motif.active'),
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

    const handleChange = (props: any, event: string, value: string) => {
        switch (event) {
            case "active":
                props.active = !props.active;
                if (!props.active) {
                    state.active = false;
                    setState({...state});
                }
                break;
            case "duration":
                props.duree = value;
                break;
            case "min":
                props.min = value;
                break;
            case "max":
                props.max = value;
                break;
            default:
                break
        }
        setRows([...rows]);
    }

    const handleConfig = (props: any, event: string) => {
        // @ts-ignore
        state[event] = !state[event];
        if (event === 'active') {
            rows.map(row => row.active = state.active);
            setRows([...rows]);
        }
        setState({...state});
    }

    const editMotif = (props: any) =>{
        setEdit(true)
        setSelected(props);
    }

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('motif.path')}</p>
                    <Button type='submit'
                            variant="contained"
                            onClick={()=>{editMotif(null)}}
                            color="success">
                        {t('motif.add')}
                    </Button>
                </RootStyled>
            </SubHeader>
            <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <MedTable headers={headCells}
                        rows={rows}
                        state={state}
                        from={'motif'}
                        t={t}
                        editMotif={editMotif}
                        handleConfig={handleConfig}
                        handleChange={handleChange}/>


                <Drawer
                    anchor={'right'}
                    open={edit}
                    dir={direction}
                    onClose={()=>{setEdit(false)}}>
                    <EditMotifDialog data={selected} close={() => {
                                        setEdit(false)
                                    }}/>
                </Drawer>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
    }
})
export default Motif

Motif.auth = true;

Motif.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
