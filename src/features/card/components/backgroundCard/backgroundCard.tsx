import { Typography, Paper, Grid, Button } from "@mui/material";
import Icon from "@themes/urlIcon";
import { useTranslation } from "next-i18next";
export default function BackgroundCard() {
  const { t, ready } = useTranslation("patient", { keyPrefix: "background" });
  if (!ready) return <div>Loading...</div>;
  return (
    <div>
      <Typography
        variant="body1"
        color="text.primary"
        fontFamily="Poppins"
        sx={{ my: 1, pt: 1 }}
      >
        {t("title")}
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={6} sm={12} xs={12}>
          <Paper sx={{ p: 1.5 }}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                svg: { mr: 1 },
              }}
              component="span"
            >
              <Icon path="ic-doc" /> {t("family-history")}
            </Typography>
            <Typography color="text.secondary" fontSize={11}>
              Diabète / Hypoglycémie
            </Typography>
            <Typography mt={0.5} color="text.secondary" fontSize={11}>
              Problèmes cardiaques / Hypertension
            </Typography>
            <Button
              variant="text"
              color="primary"
              size="small"
              sx={{
                mt: 1,
                svg: { width: 15, mr: 0.5, path: { fill: "#0696D6" } },
              }}
            >
              <Icon path="ic-plus" /> {t("add-background")}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
