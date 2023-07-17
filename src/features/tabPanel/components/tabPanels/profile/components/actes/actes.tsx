import { Chip, Paper, Stack, Typography } from "@mui/material";
import IconUrl from "@themes/urlIcon";
import BasicAlert from "@themes/overrides/Alert";
import { MultiSelect } from "@features/multiSelect";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "next-i18next";
import Acte from "@interfaces/Acte";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));


const actes: Acte[] = [
    { id: 1, title: "Electrothérapie" },
    { id: 2, title: "Physiothérapie" },
    { id: 3, title: "Accouchement sans douleur" },
    { id: 4, title: "Rééducation en traumatologie" },
    { id: 5, title: "Sport médical" },
    { id: 6, title: "Rééducation périnéale" },
    { id: 7, title: "électrofitness" },
    { id: 8, title: "Luminothérapie 7 couleurs" },
    { id: 11, title: " sans douleur" },
    { id: 12, title: " en traumatologie" },
    { id: 14, title: "Rééducation " },
    { id: 15, title: "électrofitnesxs" },
    { id: 16, title: "Luminothérapie" },
];

function Actes() {
    const [mainActes, setMainActes] = useState<Acte[]>([]);
    const [secondaryActes, setSecondaryActes] = useState<Acte[]>([]);
    const [selected, setSelected] = useState<Acte>({ id: 0, title: "" });
    const [suggestion, setSuggestion] = useState<any[]>([...actes]);
    const [alert, setAlert] = useState<boolean>(false);
    const [secAlert, setSecAlert] = useState<boolean>(false);


    const onDrop = (id: string, ev: any) => {
        const deleteSuggestion = suggestion.filter((v) => v.id !== selected.id);
        setSuggestion([...deleteSuggestion]);
        if (id === "main" && mainActes.length < 10) {
            setMainActes([...mainActes, selected]);
        } else {
            const deleteSuggestion = suggestion.filter((v) => v !== selected);
            setSuggestion([...deleteSuggestion]);
            setSecondaryActes([...secondaryActes, selected]);
        }
    };

    useEffect(() => {
        const selectedActes = [...mainActes, ...secondaryActes];

        setSuggestion(actes.filter((nb) => {
            return !selectedActes.some((item) => item.id === nb.id);
        }));
    }, [mainActes, secondaryActes]);

    const onDrag = (prop: any) => (ev: any) => {
        ev.dataTransfer.setData("Text", ev.target.id);
        ev.effectAllowed = "copy";
        setSelected({ ...prop });
    };

    const allowDrop = (ev: { preventDefault: () => void }) => {
        ev.preventDefault();
    };

    const onClickChip = (prop: any) => () => {
        const deleteSuggestion = suggestion.filter((v) => v.id !== prop.id);
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

    const { t, ready } = useTranslation('editProfile', { keyPrefix: "steppers.stepper-2" });
    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                {t('title')}
            </Typography>

            <Typography variant="body1" color="text.primary" mb={5}>
                {t("sub-title")}
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
                            fill: theme => theme.palette.warning.main,
                        },
                    },
                }}
            >
                {t("main")}{" "}
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
                data={actes.filter((a) => !secondaryActes.some((m) => a.id === m.id))}
                onDrop={onDrop}
                all={[...mainActes, ...secondaryActes]}
                onDragOver={allowDrop}
                onChange={(event: React.ChangeEvent, value: any[]) => {
                    onChangeState(value, mainActes, setMainActes);
                }}
                initData={mainActes}
                limit={10}
                helperText={t("length")}
                placeholder={t("typing")}
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
                            fill: theme => theme.palette.warning.main,
                        },
                    },
                }}
            >
                {t("second")}{" "}
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
                data={actes.filter((a) => !mainActes.some((m) => a.id === m.id))}
                all={[...mainActes, ...secondaryActes]}
                onDrop={onDrop}
                onDragOver={allowDrop}
                onChange={(event: React.ChangeEvent, value: any[]) => {
                    onChangeState(value, secondaryActes, setSecondaryActes);
                }}
                initData={secondaryActes}
                placeholder={t("typing")}
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
                            fill: theme => theme.palette.warning.main,
                        },
                    },
                }}
            >
                {t("suggestion")}
            </Typography>
            <Stack direction="row" flexWrap="wrap" sx={{ bgcolor: "transparent" }}>
                {suggestion.map((v) => (
                    <Chip
                        key={v.id}
                        id={v.id}
                        label={v.title}
                        color="default"
                        clickable
                        draggable="true"
                        onDragStart={onDrag(v)}
                        onClick={onClickChip(v)}
                        onDelete={onClickChip(v)}
                        deleteIcon={<AddIcon />}
                        sx={{
                            bgcolor: (theme) => theme.palette.grey["A300"],
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
        </>
    )
}

export default Actes;
