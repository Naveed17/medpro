import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import AddIcon from "@mui/icons-material/Add";
import {Box} from "@mui/system";
import {Chip, Paper, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {MultiSelect} from "@features/multiSelect";
import BasicAlert from "@themes/overrides/Alert";
import useRequest from "@app/axios/axiosServiceApi";
import {useRouter} from "next/router";

function Actes() {

    const {data: session} = useSession();


    const [mainActes, setMainActes] = useState<ActModel[]>([]);
    const [secondaryActes, setSecondaryActes] = useState<ActModel[]>([]);
    const [selected, setSelected] = useState<ActModel>();
    const [suggestion, setSuggestion] = useState<ActModel[]>([]);
    const [alert, setAlert] = useState<boolean>(false);
    const [secAlert, setSecAlert] = useState<boolean>(false);
    const [acts, setActs] = useState<ActModel[]>([]);
    const router = useRouter();

    const headers = {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    }

    const {data: user} = session as Session;

    const {data, error} = useRequest({
        method: "GET",
        url: "/api/public/acts/" + router.locale,
        params: {"specialities[]": "a84a60e8-9e9b-3234-aa35-e4458fd6fdde"},
        headers,
    });

    useEffect(() => {
        if (data !== undefined) {
            setActs(((data as any).data) as ActModel[])
            setSuggestion(((data as any).data) as ActModel[]);
        }
    }, [data]);

    const onDrop = (id: string, ev: any) => {
        const deleteSuggestion = (suggestion as ActModel[]).filter((v) => v.uuid !== (selected as ActModel).uuid);
        setSuggestion([...deleteSuggestion]);
        if (id === "main" && mainActes.length < 10) {
            setMainActes([...mainActes, (selected as ActModel)]);
        } else {
            const deleteSuggestion = (suggestion as ActModel[]).filter((v) => v !== selected);
            setSuggestion([...deleteSuggestion]);
            setSecondaryActes([...secondaryActes, (selected as ActModel)]);
        }
    };

    useEffect(() => {
        const selectedActes = [...mainActes, ...secondaryActes];

        setSuggestion(acts.filter((nb) => {
            return !selectedActes.some((item) => item.uuid === nb.uuid);
        }));
    }, [mainActes, secondaryActes]);

    const onDrag = (prop: any) => (ev: any) => {
        ev.dataTransfer.setData("Text", ev.target.id);
        ev.effectAllowed = "copy";
        setSelected({...prop});
    };

    const allowDrop = (ev: { preventDefault: () => void }) => {
        ev.preventDefault();
    };

    const onClickChip = (prop: any) => () => {
        const deleteSuggestion = (suggestion as ActModel[]).filter((v) => v.uuid !== prop.uuid);
        setSuggestion([...deleteSuggestion]);
        if (mainActes.length < 10) {
            setMainActes([...mainActes, prop]);
        } else {
            setSecondaryActes([...secondaryActes, prop]);
        }
    };

    const onChangeState = (
        val: any[],
        items: any[],
        setItems: (arg0: any[]) => void
    ) => {
        setItems(val.slice(0, 10));
    };

    const {t, ready} = useTranslation("settings");
    if (!ready) return <>loading translations...</>;

    return (
        <Box
            bgcolor="#F0FAFF"
            sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}
        >
            <Paper sx={{p: 2}}>
                <Typography variant="body1" color="text.primary" mb={5}>
                    {t("actes.selectActes")}
                </Typography>

                <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight={600}
                    mb={2}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        svg: {
                            ml: 1,
                            path: {
                                fill: "#FFD400",
                            },
                        },
                    }}
                >
                    {t("actes.main")}{" "}
                    {!alert && (
                        <IconUrl
                            onChange={() => {
                                setAlert(true);
                            }}
                            path="danger"
                        />
                    )}
                    {alert && (
                        <BasicAlert
                            icon="danger"
                            sx={{
                                width: "fit-content",
                                padding: "0  15px 0 0",
                                margin: "0 10px",
                            }}
                            data={"Actes alert message"}
                            onChange={() => {
                                setAlert(false);
                            }}
                            color="warning"
                        >
                            info
                        </BasicAlert>
                    )}
                </Typography>

                <MultiSelect
                    id="main"
                    data={acts.filter((a) => !secondaryActes.some((m) => a.uuid === m.uuid))}
                    onDrop={onDrop}
                    all={[...mainActes, ...secondaryActes]}
                    onDragOver={allowDrop}
                    onChange={(event: React.ChangeEvent, value: any[]) => {
                        onChangeState(value, mainActes, setMainActes);
                    }}
                    initData={mainActes}
                    limit={10}
                    helperText={t("actes.max")}
                    placeholder={t("actes.typing")}
                />

                <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight={600}
                    mb={2}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 6,
                        svg: {
                            ml: 1,
                            path: {
                                fill: "#FFD400",
                            },
                        },
                    }}
                >
                    {t("actes.secondary")}{" "}
                    {!secAlert && (
                        <IconUrl
                            onChange={() => {
                                setSecAlert(true);
                            }}
                            path="danger"
                        />
                    )}{" "}
                    {secAlert && (
                        <BasicAlert
                            icon="danger"
                            sx={{
                                width: "fit-content",
                                padding: "0  15px 0 0",
                                margin: "0 10px",
                            }}
                            data={"Actes alert message"}
                            onChange={() => {
                                setSecAlert(false);
                            }}
                            color="warning"
                        >
                            info
                        </BasicAlert>
                    )}
                </Typography>

                <MultiSelect
                    id="second"
                    data={acts.filter((a) => !mainActes.some((m) => a.uuid === m.uuid))}
                    all={[...mainActes, ...secondaryActes]}
                    onDrop={onDrop}
                    onDragOver={allowDrop}
                    onChange={(event: React.ChangeEvent, value: any[]) => {
                        onChangeState(value, secondaryActes, setSecondaryActes);
                    }}
                    initData={secondaryActes}
                    helperText={t("")}
                    placeholder={t("actes.typing")}
                />

                <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight={600}
                    mb={2}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 6,
                        svg: {
                            ml: 1,
                            path: {
                                fill: "#FFD400",
                            },
                        },
                    }}
                >
                    {t("actes.suggestion")}
                </Typography>
                <Stack direction="row" flexWrap="wrap" sx={{bgcolor: "transparent"}}>
                    {(suggestion as ActModel[]).map((v: ActModel) => (
                        <Chip
                            key={v.uuid}
                            id={v.uuid}
                            label={v.name}
                            color="default"
                            clickable
                            draggable="true"
                            onDragStart={onDrag(v)}
                            onClick={onClickChip(v)}
                            onDelete={onClickChip(v)}
                            deleteIcon={<AddIcon/>}
                            sx={{
                                bgcolor: "#E4E4E4",
                                filter: "drop-shadow(10px 10px 10px rgba(0, 0, 0, 0))",
                                mb: 1,
                                mr: 1,
                                cursor: "move",
                                "&:active": {
                                    boxShadow: "none",
                                    outline: "none",
                                },
                                "& .MuiChip-deleteIcon": {
                                    color: (theme) => theme.palette.text.primary,
                                },
                            }}
                        />
                    ))}
                </Stack>
            </Paper>
        </Box>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'settings']))
    }
})

export default Actes;

Actes.auth = true;

Actes.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
