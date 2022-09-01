// hooks
import { useState } from "react";
import { useTranslation } from "next-i18next";
// material
import { Typography, Paper, Grid, Button, Skeleton } from "@mui/material";
// ____________________________________
import { Dialog, PatientDetailsDialog } from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import RootStyled from "./overrides/rootStyled";
// utils
import Icon from "@themes/urlIcon";

// selected dumy data
const cardItems: PatientDetailsList[] = [
  {
    id: 0,
    title: "title",
    icon: "ic-doc",
    items: [
      { id: 0, name: "Diabète / Hypoglycémie" },
      { id: 1, name: "Problèmes cardiaques / Hypertension" },
    ],
  },
];

const emptyObject = {
  title: "",
  value: "",
};

function BackgroundCard({ ...props }) {
  const { loading, patient } = props;
  const [open, setopen] = useState(false);
  const [data, setdata] = useState([...cardItems]);
  const [selected, setselected] = useState({});

  const onChangeList = (prop: PatientDetailsList) => {
    const newState = data.map((obj) => {
      if (obj.id === prop.id) {
        return { ...prop };
      }
      return obj;
    });
    setdata(newState);
  };
  const { t, ready } = useTranslation("patient", { keyPrefix: "background" });
  if (!ready) return <div>Loading...</div>;
  return (
    <RootStyled>
      <Typography
        variant="body1"
        color="text.primary"
        fontFamily="Poppins"
        sx={{ my: 1, pt: 1 }}
      >
        {loading ? (
          <Skeleton variant="text" sx={{ maxWidth: 200 }} />
        ) : (
          t("title")
        )}
      </Typography>
      <Grid container spacing={2}>
        {Object.keys(loading ? emptyObject : patient.antecedents).map(
          (item: any) => (
            <Grid key={Math.random()} item md={6} sm={12} xs={12}>
              <Paper sx={{ p: 1.5, borderWidth: 0, height: "100%" }}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  className="item"
                  component="span"
                >
                  {/* <Icon path={item.icon} /> */}
                  {loading ? (
                    <Skeleton
                      variant="text"
                      sx={{ maxWidth: 150, width: "100%" }}
                    />
                  ) : (
                    item.split("_").join(" ")
                  )}
                </Typography>
                {(loading
                  ? Array.from(new Array(3))
                  : patient.antecedents[item]
                ).map((v: any) => (
                  <Typography
                    key={Math.random()}
                    mt={0.5}
                    color="text.secondary"
                    fontSize={11}
                  >
                    {loading ? <Skeleton variant="text" /> : v.name}
                  </Typography>
                ))}
                {loading ? (
                  <Skeleton variant="text" sx={{ maxWidth: 200 }} />
                ) : (
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setopen(true);
                      setselected(item);
                    }}
                    sx={{
                      mt: 1,
                      svg: { width: 15, mr: 0.5, path: { fill: "#0696D6" } },
                    }}
                  >
                    <Icon path="ic-plus" /> {t("add-background")}
                  </Button>
                )}
              </Paper>
            </Grid>
          )
        )}
      </Grid>
      <Dialog
        action={PatientDetailsDialog}
        onChangeList={(v: PatientDetailsList) => onChangeList(v)}
        open={open}
        data={selected}
        title={t("title")}
        dialogClose={() => setopen(false)}
        actionDialog={
          <>
            <Button
              onClick={() => setopen(false)}
              variant="text-primary"
              startIcon={<CloseIcon />}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={() => setopen(false)}
              variant="contained"
              // onClick={dialogSave}
              startIcon={<Icon path="ic-dowlaodfile"></Icon>}
            >
              {t("register")}
            </Button>
          </>
        }
      ></Dialog>
    </RootStyled>
  );
}
export default BackgroundCard;
