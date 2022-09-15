import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {useTranslation} from "next-i18next";
import {Box, Button, DialogActions} from "@mui/material";
import {configSelector, DashLayout} from "@features/base";
import {Otable} from "@features/table";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {useAppSelector} from "@app/redux/hooks";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Theme} from "@mui/material/styles";

function Agenda() {

    const {data: session, status} = useSession();
    const router = useRouter();
    const [selected, setSelected] = useState<any>();
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([])

    const {direction} = useAppSelector(configSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAgendasResponse, error: errorHttpAgendas} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const agenda = httpAgendasResponse ? (httpAgendasResponse as HttpResponse).data : undefined;
    //setRows(agenda);
    useEffect(() => {
        if (agenda !== undefined)
            setRows(agenda);
    }, [agenda])

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
            id: "autoConfirm",
            numeric: false,
            disablePadding: false,
            label: "autoConfirm",
            align: "center",
            sortable: false,
        },
        {
            id: "default",
            numeric: true,
            disablePadding: false,
            label: "default",
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

    const handleChange = (props: any, e: any) => {

        if (e === 'remove') {
            setOpen(true);
            setSelected({
                title: t('askRemove'),
                subtitle: t('subtitleRemove'),
                icon: "/static/icons/ic-agenda.svg",
                name1: props.name,
                name2: props.type,
                data: props
            });
        } else if (e === 'edit')
            console.log(props)
        else if (e === 'isDefault') {
            rows.map((row: any) => row.isDefault = false);
            props[e] = true;
        } else
            props[e] = !props[e];

        setRows([...rows]);
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
                    handleChange={handleChange}/>
            </Box>

            <Dialog action={"remove"}
                    open={open}
                    data={selected}
                    direction={direction}
                    color={(theme: Theme) => theme.palette.error.main}
                    title={t('remove')}
                    t={t}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={dialogClose}
                                    startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                            <Button variant="contained"
                                    sx={{backgroundColor: (theme: Theme) => theme.palette.error.main}}
                                    onClick={dialogSave}>{t('table.remove')}</Button>
                        </DialogActions>
                    }
            />

        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'settings']))
    }
})

export default Agenda;

Agenda.auth = true;

Agenda.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
