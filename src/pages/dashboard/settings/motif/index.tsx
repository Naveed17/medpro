import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {Box, Button, Drawer, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import {EditMotifDialog} from "@features/editMotifDialog";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {configSelector} from "@features/base";
import {useAppSelector} from "@app/redux/hooks";
import {Otable} from "@features/table";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import useRequest from "@app/axios/useRequest";
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
    const durations = useDateConverture(15, 240)
    const delay = useDateConverture(1440, 21600)

    const {data, error} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/consultation-reasons/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    useEffect(() => {
        if (data !== undefined) {
            setRows((data as any).data);
        }
    }, [data])

    const closeDraw = () => {
        setEdit(false);
    }

    const { t, ready } = useTranslation(['settings', 'common'],{
        keyPrefix: "motif.config",
    });

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
            case "active":
                props.isEnabled = !props.isEnabled;
                if (!props.isEnabled) {
                    state.isEnabled = false;
                    setState({...state});
                }
                break;
            case "duration":
                props.duration = value;
                break;
            case "min":
                props.minimumDelay = value;
                break;
            case "max":
                props.maximumDelay = value;
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
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    width={1}
                    alignItems="center">
                    <Typography  color="text.primary">
                        {t("path")}
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            editMotif(null)
                        }}
                        sx={{ml: "auto"}}
                    >
                        {t("add")}
                    </Button>
                </Stack>
            </SubHeader>
            <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <Otable headers={headCells}
                        rows={rows}
                        state={state}
                        from={'motif'}
                        t={t}
                        edit={editMotif}
                        durations={durations}
                        delay={delay}
                        handleConfig={handleConfig}
                        handleChange={handleChange}/>
                <Drawer
                    anchor={'right'}
                    open={edit}
                    dir={direction}
                    onClose={closeDraw}>
                    <EditMotifDialog data={selected}
                                     durations={durations}
                                     delay={delay}
                                     closeDraw={closeDraw}/>
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
