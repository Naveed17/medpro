import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState,} from "react";
import {SubHeader} from "@features/subHeader";
import {useTranslation} from "next-i18next";
import {Box, Button, InputAdornment, Paper, Stack, TextField, Typography, useMediaQuery, useTheme} from "@mui/material";
import {RootStyled} from "@features/toolbar";
import {useRouter} from "next/router";
import {DashLayout} from "@features/base";
import {LoadingScreen} from "@features/loadingScreen";
import {DesktopContainer} from "@themes/desktopConainter";
import {Otable} from "@features/table";
import IconUrl from "@themes/urlIcon";
import {MobileContainer} from "@themes/mobileContainer";
import {ActMobileCard} from "@features/card";
import {SubFooter} from "@features/subFooter";
import useMPActs from "@lib/hooks/rest/useMPacts";

const Toolbar = (props: any) => {
    const {t, search, handleSearch} = props
    return (
        <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 1, sm: 0}} borderBottom={1} borderColor={"divider"}
               pb={1} mb={2} alignItems={{xs: 'flex-start', sm: 'center'}} justifyContent="space-between">
            <Stack>
                <Typography variant="body2" fontWeight={500}>
                    {t("table.name")} {"CNAM"}
                </Typography>
                <Typography fontWeight={600}>
                    {t("table.act")}
                </Typography>
            </Stack>
            <TextField
                value={search}
                onChange={handleSearch}
                sx={{width: {xs: 1, sm: 'auto'}}}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconUrl path="ic-search"/>
                        </InputAdornment>
                    ),
                }}
                placeholder={t("search")}/>
        </Stack>
    )
}

function Actes() {
    const router = useRouter();
    const {t, ready} = useTranslation("settings", {keyPrefix: 'insurance.config'});
    const [search, setSearch] = React.useState("");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [mainActes, setMainActes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const {acts, error} = useMPActs({noPagination: false})
    console.log(acts)
    const headCells = [
        {
            id: "select-all",
            numeric: false,
            disablePadding: true,
            label: "select",
            sortable: false,
            align: "left",
        },
        {
            id: "act",
            numeric: false,
            disablePadding: false,
            label: "act",
            align: "left",
            sortable: true,
        },
        {
            id: "fees",
            numeric: false,
            disablePadding: false,
            label: "fees",
            align: "center",
            sortable: false,
        },
        {
            id: "rem_amount",
            numeric: true,
            disablePadding: false,
            label: "rem_amount",
            align: "center",
            sortable: false,
        },
        {
            id: "patient_share",
            numeric: true,
            disablePadding: false,
            label: "patient_share",
            align: "center",
            sortable: false,
        },
        {
            id: "apci",
            numeric: false,
            disablePadding: false,
            label: "apci",
            align: "center",
            sortable: false,
        },
    ];
    const handleChange = (row: ActModel) => {
        const updated = mainActes.map((item: ActModel) => {
            if (item.uuid === row.uuid) {
                return row
            }
            return item;
        })
        setMainActes(updated);
    }
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearch(query);
        if (query.length === 0) return setMainActes(acts?.list)
        const data = mainActes.filter((row: any) => {
            return row?.act?.name.toLowerCase().includes(query.toLowerCase())
        })
        setMainActes(data);
    }
    useEffect(() => {
        setLoading(true);
        if (acts) {
            if (isMobile) {
                setMainActes(acts as ActModel[]);
                setLoading(false);
            } else {
                const response = acts?.list ?? [];
                setMainActes(response as ActModel[]);
                setLoading(false);
            }
        }
    }, [acts]); // eslint-disable-line react-hooks/exhaustive-deps
    if (!ready || error) {
        return <LoadingScreen
            button
            {...(error ? {
                OnClick: () => router.push('/dashboard/settings/users'),
                text: 'loading-error-404-reset'
            } : {})}
        />;
    }
    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path.update")}</p>
                </RootStyled>
            </SubHeader>

            <Box className="container">
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        toolbar={<Toolbar {...{t, search, handleSearch}} />}
                        rows={mainActes}
                        from={"act-row"}
                        {...{t, loading, handleChange}}
                        total={acts?.total}
                        totalPages={acts.totalPages}
                        pagination
                    />
                </DesktopContainer>
                <MobileContainer>
                    <Paper component={Stack} spacing={1} sx={{p: 2, borderRadius: 1}}>
                        <Toolbar {...{t, search, handleSearch}} />
                        {
                            mainActes.map((act: ActModel) => (
                                <React.Fragment key={act.uuid}>
                                    <ActMobileCard row={act} {...{t, loading, handleChange}} />
                                </React.Fragment>
                            ))
                        }

                    </Paper>
                </MobileContainer>
                <Box p={4}>
                    <SubFooter sx={{".MuiToolbar-root": {justifyContent: 'flex-end'}}}>
                        <Button startIcon={<IconUrl path="ic-check"/>} variant="contained">
                            {t("save")}
                        </Button>

                    </SubFooter>
                </Box>
            </Box>
        </>
    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export const getStaticProps: GetStaticProps = async ({locale}) => {

    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "common",
                "menu",
                "patient",
                "settings",
            ])),
        },
    }
};

export default Actes;

Actes.auth = true;

Actes.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
