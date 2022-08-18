import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {Button, Box, Drawer} from "@mui/material";
import {RootStyled} from "@features/toolbar";
import {configSelector} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {useAppSelector} from "@app/redux/hooks";
import {Otable} from "@features/table";
import {PfTemplateDetail} from "@features/pfTemplateDetail";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

function PatientFileTemplates() {

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const {direction} = useAppSelector(configSelector);
    const [state, setState] = useState({
        active: true,
    });
    const [action, setAction] = useState('');
    const [data, setData] = useState<ModalModel | null>(null);
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
    const [rows, setRows] = useState<ModalModel[]>([]);
    const [open, setOpen] = useState(false);

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: modalsHttpResponse, error, mutate} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/modals/",
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {trigger} = useRequestMutation(
        {
            method: "GET",
            url: "",
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }, {revalidate: true, populateCache: true});


    useEffect(() => {
        if (modalsHttpResponse !== undefined) {
            //console.log(modalsHttpResponse);
            setRows((modalsHttpResponse as HttpResponse).data);
        }
    }, [modalsHttpResponse])

    const handleChange = (props: ModalModel, event: string, value: string) => {
        props.isEnabled = !props.isEnabled;
        setState({...state});

        const form = new FormData();
        form.append('enabled', props.isEnabled.toString());

        trigger({
            method: "PATCH",
            url: "/api/medical-entity/" + medical_entity.uuid + '/modals/' + props.uuid + '/activity',
            data: form,
            headers: {
                ContentType: 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, {revalidate: true, populateCache: true}).then(r => console.log('edit qualification', r));
    }

    const handleEdit = (props: ModalModel, event: string, value: string) => {
        console.log(event, props);
        setOpen(true);
        setAction(event);
        setData(props);
    }

    const closeDraw = () => {
        setOpen(false);
    }

    const {t, ready} = useTranslation('settings', {
        keyPrefix: "templates.config",
    });
    if (!ready) return (<>loading translations...</>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('path')}</p>
                </RootStyled>

                <Button type='submit'
                        variant="contained"
                        onClick={() => {
                            setOpen(true);
                            setData(null);
                            setAction('add');
                        }}
                        color="success">
                    {t('add')}
                </Button>
            </SubHeader>
            <Box bgcolor={theme => theme.palette.background.default}
                 sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>

                <Otable headers={headCells}
                        rows={rows}
                        state={state}
                        from={'template'}
                        t={t}
                        edit={handleEdit}
                        handleConfig={null}
                        handleChange={handleChange}/>

                <Drawer
                    anchor={'right'}
                    open={open}
                    dir={direction}
                    onClose={closeDraw}>
                    <PfTemplateDetail action={action}
                                      mutate={mutate}
                                      closeDraw={closeDraw}
                                      data={data}></PfTemplateDetail>
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
