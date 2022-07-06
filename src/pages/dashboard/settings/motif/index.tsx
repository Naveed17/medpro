import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {Box, Button, Drawer} from "@mui/material";
import {useTranslation} from "next-i18next";
import {EditMotifDialog} from "@features/editMotifDialog";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {configSelector} from "@features/base";
import {useAppSelector} from "@app/redux/hooks";
import {Otable} from "@features/table";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import useRequest from "@app/axios/axiosServiceApi";
import {useRouter} from "next/router";
import {useDateConverture} from "@app/hooks";

function Motif() {

    const {data: session} = useSession();
    const {data: user} = session as Session;
    const router = useRouter();

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [rows, setRows] = useState<ConsultationReasonTypeModel[]>([]);
    const [edit, setEdit] = useState(false);
    const [state, setState] = useState({
        duration: true,
        delay_min: true,
        delay_max: true,
        isEnabled: true
    });
    const [selected, setSelected] = useState();
    const {direction} = useAppSelector(configSelector);

    const {data, error} = useRequest({
        method: "GET",
        url: "/api/medical/entity/consultation/reason/" + medical_entity.uuid + "/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const convDate = useDateConverture(932878);


    useEffect(() => {
        if (data !== undefined) {
            //setRows((data as any).data)
        }
    }, [data])

    const closeDraw = () => {
        setEdit(false);
    }

    const {t, ready} = useTranslation('settings', {keyPrefix: "motif"});
    if (!ready) return (<>loading translations...</>);

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
            id: 'duration',
            numeric: false,
            disablePadding: false,
            label: 'duration',
            align: 'left',
            sortable: false
        },
        {
            id: 'delay_min',
            numeric: false,
            disablePadding: false,
            label: 'delay_min',
            align: 'left',
            sortable: false
        },
        {
            id: 'delay_max',
            numeric: true,
            disablePadding: false,
            label: 'delay_max',
            align: 'left',
            sortable: false
        },
        {
            id: 'agenda',
            numeric: true,
            disablePadding: false,
            label: 'agenda',
            align: 'center',
            sortable: false
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: 'type',
            align: 'center',
            sortable: true
        },
        {
            id: 'isEnabled',
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
            align: 'center',
            sortable: false
        },
    ];

    const handleChange = (props: any, event: string, value: string) => {

        switch (event) {
            case "isEnabled":
                props.isEnabled = !props.isEnabled;
                if (!props.isEnabled) {
                    state.isEnabled = false;
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
        if (event === 'isEnabled') {
            console.log(state);
            rows.map(row => row.isEnabled = state.isEnabled);
            setRows([...rows]);
        }
        setState({...state});
    }

    const editMotif = (props: any) => {
        setEdit(true)
        setSelected(props);
    }

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('path')}</p>
                    <Button type='submit'
                            variant="contained"
                            onClick={() => {
                                editMotif(null)
                            }}
                            color="success">
                        {t('add')}
                    </Button>
                </RootStyled>
            </SubHeader>
            <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <Otable headers={headCells}
                        rows={rows}
                        state={state}
                        from={'motif'}
                        t={t}
                        edit={editMotif}
                        handleConfig={handleConfig}
                        handleChange={handleChange}/>
                <Drawer
                    anchor={'right'}
                    open={edit}
                    dir={direction}
                    onClose={closeDraw}>
                    <EditMotifDialog data={selected} closeDraw={closeDraw}/>
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
export default Motif

Motif.auth = true;

Motif.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
