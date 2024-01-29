import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useEffect, useState } from "react";
import { SubHeader } from "@features/subHeader";
import { RootStyled } from "@features/toolbar";
import { useTranslation } from "next-i18next";
import { Box, Button, DialogActions, InputAdornment, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { configSelector, DashLayout, dashLayoutSelector } from "@features/base";
import { Otable } from "@features/table";
import { Dialog } from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "@lib/redux/hooks";
import { useRequestQuery } from "@lib/axios";
import { useRouter } from "next/router";
import { Theme } from "@mui/material/styles";
import { MobileContainer } from "@themes/mobileContainer";
import { DesktopContainer } from "@themes/desktopConainter";
import { SettingAgendaMobileCard, NoDataCard, InsuranceMobileCard } from "@features/card";


import { LoadingScreen } from "@features/loadingScreen";

import { useMedicalEntitySuffix } from "@lib/hooks";
import { Add } from "@mui/icons-material";
import { ActionMenu } from "@features/menu";
import IconUrl from "@themes/urlIcon";
const insuranceData = [
    {
        uuid: "01",
        name: "assurance-1",
        url: "/static/img/assurance-1.png"
    },
    {
        uuid: "02",
        name: "assurance-2",
        url: "/static/img/assurance-2.png"
    },
]
const Toolbar = (props: any) => {
    const { t, search, handleSearch } = props
    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 0 }} borderBottom={1} borderColor={"divider"} pb={1} mb={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
            <Typography fontWeight={500}>
                {t("title")}
            </Typography>
            <TextField
                value={search}
                onChange={handleSearch}
                sx={{ width: { xs: 1, sm: 'auto' } }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconUrl path="ic-search" />
                        </InputAdornment>
                    ),
                }}
                placeholder={t("search")} />
        </Stack>
    )
}
function InsuranceAndAgreement() {
    const CardData = {
        mainIcon: "convention",
        title: "no-data.title",
        description: "no-data.description"
    };


    const { t, ready } = useTranslation("settings", { keyPrefix: "insurance.config" });
    const [rows, setRows] = useState<any>([
        ...insuranceData
    ]);
    const router = useRouter();
    const [search, setSearch] = React.useState("")
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearch(query);
        if (query.length === 0) return setRows(insuranceData)
        const data = rows.filter((row: any) => {
            return row.name.toLowerCase().includes(query.toLowerCase())
        })
        setRows(data);
    }
    const handleContextMenu = (event: MouseEvent) => {

        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                :
                null,
        );
    };
    const OnMenuActions = (props: any) => {
        setContextMenu(null);
    }
    const handleTableActions = (props: { action: string, event: MouseEvent, data: any }) => {
        const { action, event, data } = props;
        switch (action) {
            case "OPEN-POPOVER":
                event.preventDefault();
                handleContextMenu(event)
                break;
            case "ON_ROUTE":
                event.preventDefault();
                router.push(`${router.pathname}/${data.uuid}`, undefined, { locale: router.locale })

        }
    }
    const handleCloseMenu = () => {
        setContextMenu(null);
    }


    if (!ready) return (<LoadingScreen button text={"loading-error"} />);
    const popoverActions = [{
        icon: <Add />,
        title: "add",
        action: "onAdd"
    }]
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
            id: "label",
            numeric: false,
            disablePadding: false,
            label: "label",
            align: "center",
            sortable: true,
        },
        {
            id: "start_date",
            numeric: false,
            disablePadding: false,
            label: "start_date",
            align: "center",
            sortable: false,
        },
        {
            id: "end_date",
            numeric: true,
            disablePadding: false,
            label: "end_date",
            align: "center",
            sortable: false,
        },
        {
            id: "empty",
            numeric: false,
            disablePadding: false,
            label: "empty",
            align: "center",
            sortable: false,
        },
    ];


    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{ margin: 0 }}>{t("path.root")}</p>
                </RootStyled>
                <Button
                    startIcon={<Add />}
                    variant="contained"
                >
                    {t("add")}
                </Button>
            </SubHeader>

            <Box className="container">

                {rows.length > 0 ? (
                    <>
                        <DesktopContainer>
                            <Otable
                                toolbar={<Toolbar {...{ t, search, handleSearch }} />}
                                headers={headCells}
                                rows={rows}
                                handleEvent={handleTableActions}
                                state={null}
                                from={"insurance-agreement"}
                                t={t}
                                edit={null}

                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Paper component={Stack} spacing={1} sx={{ p: 2, borderRadius: 1 }}>
                                <Toolbar {...{ t, search, handleSearch }} />
                                {
                                    rows.map((insurance: any) => (
                                        <React.Fragment key={insurance.uuid}>
                                            <InsuranceMobileCard t={t} row={insurance} handleEvent={handleTableActions} />
                                        </React.Fragment>
                                    ))
                                }

                            </Paper>
                        </MobileContainer>
                    </>
                ) : (
                    <NoDataCard t={t} data={CardData} ns={"settings"} />
                )}
            </Box>
            <ActionMenu {...{ contextMenu, handleClose: handleCloseMenu }}>
                {popoverActions.map(
                    (v: any, index) => (
                        <MenuItem
                            key={index}
                            className="popover-item"
                            onClick={() => {
                                OnMenuActions(v.action);
                            }}>
                            {v.icon}
                            <Typography fontSize={15} sx={{ color: "#fff" }}>
                                {t(`popover-actions.${v.title}`)}
                            </Typography>
                        </MenuItem>
                    )
                )}
            </ActionMenu>
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

export default InsuranceAndAgreement;

InsuranceAndAgreement.auth = true;

InsuranceAndAgreement.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
