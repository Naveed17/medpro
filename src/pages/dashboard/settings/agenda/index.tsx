import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {useTranslation} from "next-i18next";
import {Box, Button, DialogActions} from "@mui/material";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {Otable} from "@features/table";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {useAppSelector} from "@lib/redux/hooks";
import {useRequest} from "@lib/axios";
import {useRouter} from "next/router";
import {Theme} from "@mui/material/styles";
import {MobileContainer} from "@themes/mobileContainer";
import {DesktopContainer} from "@themes/desktopConainter";
import {SettingAgendaMobileCard, NoDataCard} from "@features/card";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {useMedicalEntitySuffix} from "@lib/hooks";

function Agenda() {
    const CardData = {
        mainIcon: "ic-agenda-+",
        title: "no-data.title",
        description: "no-data.description",
        buttonText: "no-data.button-text",
        buttonIcon: "ic-agenda-+",
        buttonVariant: "warning",
    };
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation("settings", {keyPrefix: "agenda.config"});
    const {direction} = useAppSelector(configSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [selected, setSelected] = useState<any>();
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState<any>([]);

    const {data: httpAgendasResponse} = useRequest(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${router.locale}`
    } : null);

    const agenda = httpAgendasResponse ? (httpAgendasResponse as HttpResponse).data : undefined;

    useEffect(() => {
        if (agenda !== undefined) {
            setRows(agenda);
        }
    }, [agenda]);

    const dialogClose = () => {
        setOpen(false);
    };

    const dialogSave = () => {
        setOpen(false);
    };

    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

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
        if (e === "remove") {
            setOpen(true);
            setSelected({
                title: t("askRemove"),
                subtitle: t("subtitleRemove"),
                icon: "/static/icons/ic-agenda.svg",
                name1: props.name,
                name2: props.type,
                data: props,
            });
        } else if (e === "edit") console.log(props);
        else if (e === "isDefault") {
            rows.map((row: any) => (row.isDefault = false));
            props[e] = true;
        } else props[e] = !props[e];

        setRows([...rows]);
    };
    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>
                <Button
                    type="submit"
                    variant="contained"
                    onClick={() => {
                        router.push(`/dashboard/settings/agenda/add-agenda`);
                    }}
                    color="success">
                    {t("add")}
                </Button>
            </SubHeader>

            <Box className="container">
                {rows.length > 0 ? (
                    <>
                        <DesktopContainer>
                            <Otable
                                headers={headCells}
                                rows={rows}
                                state={null}
                                from={"agenda"}
                                t={t}
                                edit={null}
                                handleChange={handleChange}
                            />
                        </DesktopContainer>
                        <MobileContainer>
                            {rows.map((item: any, idx: number) => (
                                <React.Fragment key={idx}>
                                    <SettingAgendaMobileCard
                                        data={item}
                                        t={t}
                                        handleChange={handleChange}
                                    />
                                </React.Fragment>
                            ))}
                        </MobileContainer>
                    </>
                ) : (
                    <NoDataCard t={t} data={CardData} ns={"settings"}/>
                )}
            </Box>

            <Dialog
                action={"remove"}
                open={open}
                data={selected}
                direction={direction}
                color={(theme: Theme) => theme.palette.error.main}
                title={t("remove")}
                t={t}
                actionDialog={
                    <DialogActions>
                        <Button onClick={dialogClose} startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: (theme: Theme) => theme.palette.error.main,
                            }}
                            onClick={dialogSave}>
                            {t("table.remove")}
                        </Button>
                    </DialogActions>
                }
            />
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings",
        ])),
    },
});

export default Agenda;

Agenda.auth = true;

Agenda.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
