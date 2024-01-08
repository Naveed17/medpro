import {SubHeader} from "@features/subHeader";
import {Box, Button, Drawer, Stack, Theme, Typography, useMediaQuery, useTheme} from "@mui/material";
import React, {ReactElement, useState} from "react";
import {DesktopContainer} from "@themes/desktopConainter";
import {useTranslation} from "next-i18next";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {configSelector, DashLayout} from "@features/base";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequestQuery} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useRouter} from "next/router";
import {Otable} from "@features/table";
import {DrugsDrawer} from "@features/drawer";
import {useAppSelector} from "@lib/redux/hooks";

function Drugs() {
    const theme: Theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const router = useRouter();

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "drugs.config"});
    const {direction} = useAppSelector(configSelector);

    const [edit, setEdit] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState<any>(null);

    const {data: drugsResponse, mutate: mutateDrugs} = useRequestQuery({
        method: "GET",
        url: `/api/private/drugs/${router.locale}`
    }, {
        ...ReactQueryNoValidateConfig,
        variables: {query: !isMobile ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true` : "?sort=true"}
    });

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
            id: "dci",
            numeric: false,
            disablePadding: true,
            label: "dci",
            align: "center",
            sortable: false,
        },
        {
            id: "form",
            numeric: false,
            disablePadding: true,
            label: "form",
            align: "center",
            sortable: false,
        },
        {
            id: "laboratory",
            numeric: false,
            disablePadding: true,
            label: "laboratory",
            align: "center",
            sortable: true,
        },
        {
            id: "action",
            numeric: false,
            disablePadding: false,
            label: "action",
            align: "right",
            sortable: false,
        },
    ];
    const drugs = ((drugsResponse as HttpResponse)?.data ?? []) as DrugModel[];

    const handleTableActions = (data: any) => {
        switch (data.action) {

        }
    }

    const closeDraw = () => {
        setEdit(false);
    }

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    width={1}
                    alignItems="center">
                    <Typography color="text.primary">{t("path")}</Typography>
                    <Button
                        onClick={() => setEdit(true)}
                        variant="contained"
                        color="success"
                        sx={{ml: "auto"}}>
                        {t("add")}
                    </Button>
                </Stack>
            </SubHeader>
            <DesktopContainer>
                <Box
                    sx={{
                        p: {xs: "40px 8px", sm: "30px 8px", md: 2},
                        "& table": {tableLayout: "fixed"},
                    }}>
                    <Otable
                        {...{t}}
                        headers={headCells}
                        handleEvent={handleTableActions}
                        rows={drugs}
                        from={"drugs"}
                    />
                </Box>
            </DesktopContainer>
            <Drawer anchor={"right"} open={edit} dir={direction} onClose={closeDraw}>
                <DrugsDrawer
                    {...{t, closeDraw}}
                    data={selectedDrug}
                />
            </Drawer>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings"
        ])),
    },
});

export default Drugs;

Drugs.auth = true;

Drugs.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
