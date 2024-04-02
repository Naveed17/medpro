import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {Box, Button, Drawer} from "@mui/material";
import {useTranslation} from "next-i18next";
import {Otable} from "@features/table";
import {useAppSelector} from "@lib/redux/hooks";
import {InsctructionDetails} from "@features/instructionDetails";
import {LoadingScreen} from "@features/loadingScreen";

function Instructions() {
    const [edit, setEdit] = useState(false);
    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Instructions 1',
            actif: true
        },
        {
            id: 2,
            name: 'Instructions 2',
            actif: true
        },
        {
            id: 3,
            name: 'Instructions 3',
            actif: true
        },
        {
            id: 4,
            name: 'Instructions 4',
            actif: true
        },
        {
            id: 5,
            name: 'Instructions 5',
            actif: true
        },
        {
            id: 6,
            name: 'Instructions 6',
            actif: true
        },
    ]);
    const {direction} = useAppSelector(configSelector);

    const {t, ready, i18n} = useTranslation("settings", {keyPrefix: "instructions.config"});

    const closeDraw = () => {
        setEdit(false);
    };

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
            id: "actif",
            numeric: true,
            disablePadding: false,
            label: "actif",
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

    const handleChange = (props: any, event: string, value: string) => {
        props.actif = !props.actif;
        setRows([...rows]);
    };

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ['settings']);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

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
                        setEdit(true);
                    }}
                    color="success">
                    {t("add")}
                </Button>
            </SubHeader>

            <Box className="container">
                <Otable headers={headCells}
                        rows={rows}
                        state={null}
                        from={'instructions'}
                        t={t}
                        edit={null}
                        handleConfig={null}
                        handleChange={handleChange}/>
            </Box>

            <Drawer
                anchor={'right'}
                open={edit}
                dir={direction}
                onClose={closeDraw}>
                <InsctructionDetails closeDraw={closeDraw}/>
            </Drawer>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, [
            "common",
            "menu",
            "settings"
        ])),
    },
});

export default Instructions;
Instructions.auth = true;

Instructions.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
