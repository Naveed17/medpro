import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState, useEffect } from "react";
import {DashLayout} from "@features/base";
import { Box, Typography, Paper, Chip, Stack } from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import AddIcon from "@mui/icons-material/Add";
import Acte from "@interfaces/Acte";
import BasicAlert from "@themes/overrides/Alert";
import { MultiSelect } from "@features/multiSelect";

function Actes() {

    const actes: Acte[] = [
        {id: 1, title: "Electrothérapie"},
        {id: 2, title: "Physiothérapie"},
        {id: 3, title: "Accouchement sans douleur"},
        {id: 4, title: "Rééducation en traumatologie"},
        {id: 5, title: "Sport médical"},
        {id: 6, title: "Rééducation périnéale"},
        {id: 7, title: "électrofitness"},
        {id: 8, title: "Luminothérapie 7 couleurs"},
        {id: 9, title: "a"},
        {id: 10, title: "b"},
        {id: 11, title: " sans douleur"},
        {id: 12, title: " en traumatologie"},
        {id: 13, title: "Sport "},
        {id: 14, title: "Rééducation "},
        {id: 15, title: "électrofitnesxs"},
        {id: 16, title: "Luminothérapie"},
    ];

    const [mainActes, setMainActes] = useState<Acte[]>([]);
    const [secondaryActes, setSecondaryActes] = useState<Acte[]>([]);
    const [selected, setSelected] = useState<Acte>({id: 0, title: ""});
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

  const { t, ready } = useTranslation("settings");
  if (!ready) return <>loading translations...</>;

  return (
    <Box
      className="container"
    >
      <Paper sx={{ p: 2 }}>
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
                fill: theme => theme.palette.warning.main,
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
          data={actes.filter((a) => !secondaryActes.some((m) => a.id === m.id))}
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
                fill: theme => theme.palette.warning.main,
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
          data={actes.filter((a) => !mainActes.some((m) => a.id === m.id))}
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
                fill: theme => theme.palette.warning.main,
              },
            },
          }}
        >
          {t("actes.suggestion")}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      "common",
      "menu",
      "settings",
    ])),
  },
});

export default Actes;

Actes.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
