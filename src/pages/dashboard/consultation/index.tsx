import React, { useState } from 'react';
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";
import { Box, Typography, Stack, useMediaQuery, TextField, Button, Grid } from "@mui/material";
import { DashLayout } from "@features/base";
import { SubHeader } from "@features/subHeader";
import { SubFooter } from '@features/subFooter';
import { DetailsCard } from '@features/card';
import { DocumentButton } from '@features/buttons';
import { DrawerBottom } from '@features/drawerBottom';
import { ConsultationFilter } from '@features/leftActionBar';
import { ConsultationCard } from '@features/card';
import rows from '@features/card/components/detailsCard/config'
import Icon from "@themes/urlIcon";
import { Theme, } from '@mui/material/styles';
import { upperFirst } from "lodash";
const data = [
  {
    id: 0,
    color: "success",
    title: "patients file",
    icon: "ic-doc",
    action: true,
  },

  {
    id: 1,
    title: "medical observation",
    icon: "ic-voir",
    color: "warning",
    isMain: true,
  },
  {
    id: 2,
    title: "documents",
    icon: "consultation/ic-text",
    color: "primary",
    isLast: true,
  },
];

function Consultation() {
  const { t, ready } = useTranslation("consultation");
  const [open, setopen] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  if (!ready) return <>loading translations...</>;
  return (
    <>
      <SubHeader>
        <Typography variant="subtitle2" color="text.primary">
          {t("subheader.title")}
        </Typography>
        <Stack spacing={2} direction="row" alignItems="center" ml={'auto'} display={{ xs: 'flex', md: 'none' }}>
          {
            data?.map((item: any) => (
              <Button
                onClick={() => setopen(item.id)}
                sx={{ minWidth: 40, textTransform: 'capitalize', color: theme => theme.palette.text.primary, '& svg': { width: 14, height: 14, '& path': { fill: theme => theme.palette.text.primary } } }} variant='contained' color={item.color} key={Math.random()}>
                <Icon path={item.icon} />
              </Button>
            ))
          }
        </Stack>
      </SubHeader>
      <Box className="container">
        <Stack
          direction="row"
          spacing={2}
          sx={{
            "& .MuiPaper-root:not(style)+:not(style)": {
              ml: { md: 2, sm: 0, xs: 0 },
            },
          }}
        >
          {(isMobile ? data.filter(item => item.id === open) : data).map((item, index) => (
            <React.Fragment key={item.id}>
              <ConsultationCard item={item} index={index} t={t} isMobile={isMobile} collapse={(v: boolean) => setCollapse(v)} >
                {(item.id === 0) && (
                  (collapse || isMobile) && (
                    <Stack spacing={1} p={2}>
                      <DetailsCard rows={rows} consultation />
                    </Stack>
                  )
                )}
                {item.id === 1 && (
                  <Stack spacing={2} p={2}>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                        {t("notes")}
                      </Typography>
                      <TextField placeholder={t('hint text')} fullWidth multiline rows={7} />
                    </Box>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                        {t("conclusion")}
                      </Typography>
                      <TextField placeholder={t('hint text')} fullWidth multiline rows={7} />
                    </Box>
                  </Stack>
                )}
                {item.id === 2 && (
                  <Box p={1.5}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={12}>
                        <DocumentButton icon="ic-text" lable="Report" t={t} handleOnClick={(v: string) => console.log(v)} />
                      </Grid>
                      <Grid item xs={6} md={12}>
                        <DocumentButton icon="ic-soura" lable="Report" t={t} handleOnClick={(v: string) => console.log(v)} />
                      </Grid>
                      <Grid item xs={6} md={12}>
                        <DocumentButton icon="ic-ordonance" lable="Report" t={t} handleOnClick={(v: string) => console.log(v)} />
                      </Grid>
                      <Grid item xs={6} md={12}>
                        <DocumentButton icon="ic-traitement" lable="Report" t={t} handleOnClick={(v: string) => console.log(v)} />
                      </Grid>
                      <Grid item xs={6} md={12}>
                        <DocumentButton icon="ic-analyse" lable="Report" t={t} handleOnClick={(v: string) => console.log(v)} />
                      </Grid>
                      <Grid item xs={6} md={12}>
                        <DocumentButton icon="ic-lettre" lable="Report" t={t} handleOnClick={(v: string) => console.log(v)} />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </ConsultationCard>
            </React.Fragment>
          ))}
        </Stack>

      </Box>
      <SubFooter sx={{ display: { xs: 'none', md: 'block' } }}>
        <Stack width={1} direction="row" spacing={2} justifyContent="flex-end">
          <Button>
            {upperFirst(t("cancel"))}
          </Button>
          <Button variant="contained" color="primary">
            {upperFirst(t("end of consultation"))}
          </Button>
        </Stack>
      </SubFooter>
      <Button
        startIcon={<Icon path="ic-filter" />}
        onClick={() => setDrawer(!drawer)}
        sx={{ position: 'fixed', bottom: 50, transform: 'translateX(-50%)', left: '50%', zIndex: 999, display: { xs: 'flex', md: 'none' } }}
        variant="filter"
      >
        Filtrer (0)
      </Button>
      <DrawerBottom
        handleClose={() => setDrawer(false)}
        open={drawer}
        title={null}
      >
        <ConsultationFilter />
      </DrawerBottom>
    </>
  );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
      fallback: false,
    ...(await serverSideTranslations(locale as string, ["consultation", "menu", "common"])),
  },
});
export default Consultation;
Consultation.auth = true;
Consultation.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
