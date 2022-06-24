import React, { useState, useRef, useEffect } from 'react';
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";
import { Box, Typography, Stack, Paper, IconButton, useMediaQuery, Divider, TextField } from "@mui/material";
import { DashLayout } from "@features/base";
import SubHeader from "@features/subHeader/components/subHeader";
import { Label } from '@features/label'
import { DetailsCard } from '@features/detailsCard';
import { DocumentButton } from '@features/documentButton';
import rows from '@features/detailsCard/components/config'
import Icon from "@themes/urlIcon";
import { useTheme, Theme, PaletteColor } from '@mui/material/styles';
const data = [
  {
    id: 0,
    color: "success",
    title: "Patients file",
    icon: "ic-doc",
    action: true,
  },

  {
    id: 1,
    title: "Medical observation",
    icon: "ic-voir",
    color: "warning",
    isMobile: true,
    isMain: true,
  },
  {
    id: 2,
    title: "Documents",
    icon: "consultation/ic-text",
    color: "primary",
    isLast: true,
  },
];
function Consultation() {
  const { t, ready } = useTranslation("consultation", { keyPrefix: 'consultation' });
  const theme: Theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setopen] = useState(false);
  const [offsetTop, setOffsetTop] = useState(0);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    if (ref.current) {
      setOffsetTop(ref.current.offsetTop);
    }
  }, []);
  if (!ready) return <>loading translations...</>;
  return (
    <>
      <SubHeader>
        <Typography variant="subtitle2" color="text.primary">
          {t("title")}
        </Typography>
      </SubHeader>
      <Box className="container">
        <div>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            {matches && (
              <>
                {data.map(
                  (item, index) =>
                    <React.Fragment key={item.id}>
                      {!item.isMain && <Box />}
                    </React.Fragment>
                )}
              </>
            )}
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            display={{ xs: "none", md: "flex" }}
            sx={{
              "& .MuiPaper-root:not(style)+:not(style)": {
                ml: { md: 2, sm: 0, xs: 0 },
              },
            }}
          >
            {data.map((item, index) => (
              <Paper
                key={item.id}
                elevation={0}
                ref={ref}
                sx={{
                  borderTop: `4px solid ${(theme?.palette[item.color as keyof typeof theme.palette] as PaletteColor).main}`,
                  boxShadow: "none",
                  height: `calc(100vh - ${offsetTop + 100}px)`,
                  overflowY: "auto",
                  overflowX: "hidden",
                  width: item.isLast ? 138 : !item.isMain && !open ? 42 : "100%",
                  minWidth: item.isLast ? 138 : !item.isMain && !open ? 42 : "auto",
                  display:
                    item.isMain || item.isMobile
                      ? "block"
                      : { md: "block", sm: "none", xs: "none" },
                }}
              >
                <Box
                  sx={
                    item.isLast ||
                      item.isMain ||
                      open ? {} : {
                      transform: "rotate(90deg)",
                      width: "140px",
                      mt: "45px",
                      ml: "-50px",
                    }
                  }
                >
                  <Box p={1} sx={{ display: "flex", alignItems: "center" }}>
                    {item.action && (
                      <IconButton onClick={() => setopen(!open)} size="small">
                        <Icon path="ic-flesh-droite" />
                      </IconButton>
                    )}

                    <Label
                      variant="filled"
                      color={item.color}
                      sx={{
                        color: item.isLast ? 'common.white' : "text.primary",
                        minWidth: "auto",
                        my: item.isMain && 0.4,
                        svg: {
                          mr: 1,
                          width: 14,
                          height: 14,
                          path: {
                            fill: item.isLast ? theme.palette.common.white : theme.palette.text.primary,
                          },
                        },

                      }}
                    >
                      <Icon path={item.icon} />
                      {t(item.title.toLowerCase())}
                    </Label>
                  </Box>
                </Box>
                {(!item.isMain && !open && !item.isLast) ? null : <Divider />}
                {(open && index === 0) && (
                  <Stack spacing={1} p={2}>
                    <DetailsCard rows={rows} consultation />
                  </Stack>
                )}
                {index === 1 && (
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
                {index === 2 && (
                  <Stack spacing={1} p={2}>
                    <DocumentButton icon="ic-text" lable="Report" handleOnClick={(v) => console.log(v)} />
                    <DocumentButton icon="ic-soura" lable="Report" handleOnClick={(v) => console.log(v)} />
                    <DocumentButton icon="ic-ordonance" lable="Report" handleOnClick={(v) => console.log(v)} />
                    <DocumentButton icon="ic-traitement" lable="Report" handleOnClick={(v) => console.log(v)} />
                    <DocumentButton icon="ic-analyse" lable="Report" handleOnClick={(v) => console.log(v)} />
                    <DocumentButton icon="ic-lettre" lable="Report" handleOnClick={(v) => console.log(v)} />

                  </Stack>
                )}
              </Paper>
            ))}
          </Stack>
        </div>
      </Box>
    </>
  );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["patient", "menu"])),
  },
});
export default Consultation;

Consultation.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
