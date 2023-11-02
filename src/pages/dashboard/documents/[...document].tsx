import {GetStaticPaths, GetStaticProps} from "next";
import React, {ReactElement, useEffect} from "react";
import {DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {DocToolbar} from "@features/toolbar";
import {Box, Stack} from "@mui/material";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {toggleSideBar} from "@features/menu";
import {useAppDispatch} from "@lib/redux/hooks";
import {Otable} from "@features/table";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {SubFooter} from "@features/subFooter";
import IconUrl from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";

// table head data
const headCells: readonly HeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "header.name",
        sortable: true,
        align: "left"
    },
    {
        id: "value",
        numeric: false,
        disablePadding: true,
        label: "header.value",
        sortable: true,
        align: "left"
    }
]

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Document() {
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("docs");

    useEffect(() => {
        dispatch(toggleSideBar(true));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: {xs: "column", md: "row"},
                        py: {md: 0, xs: 2},
                    }
                }}>
                <DocToolbar/>
            </SubHeader>
            <Box className="container">
                <Otable
                    {...{t}}
                    headers={headCells}
                    rows={[]}
                    total={0}
                    totalPages={1}
                    from={"patient"}
                    pagination
                />

                <Box pt={8}>
                    <SubFooter>
                        <Stack
                            width={1}
                            spacing={{xs: 1, md: 0}}
                            padding={{xs: 1, md: 0}}
                            direction={{xs: "column", md: "row"}}
                            alignItems="flex-end"
                            justifyContent={"flex-end"}>

                            <LoadingButton
                                loadingPosition={"start"}
                                onClick={() => {

                                }}
                                color={"primary"}
                                className="btn-action"
                                startIcon={<IconUrl path="add-doc"/>}
                                variant="contained"
                                sx={{".react-svg": {mr: 1}}}>
                                {t("Classer le document")}
                            </LoadingButton>
                        </Stack>
                    </SubFooter>
                </Box>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, ["menu", "common", "docs", "agenda"])),
        },
    };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
}

export default Document;

Document.auth = true;

Document.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
}
