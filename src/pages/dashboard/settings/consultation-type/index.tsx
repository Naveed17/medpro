import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useEffect, useState } from "react";
import { DashLayout } from "@features/base";
import {
  Box,
  Button,
  Container,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { MotifTypeDialog } from "@features/motifTypeDialog";
import { SubHeader } from "@features/subHeader";
import { configSelector } from "@features/base";
import { useAppSelector } from "@app/redux/hooks";
import { Otable } from "@features/table";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRequest } from "@app/axios";
import { useRouter } from "next/router";
import { DesktopContainer } from "@themes/desktopConainter";
import { MobileContainer } from "@themes/mobileContainer";
import { MotifTypeCard } from "@features/card";
import { LoadingScreen } from "@features/loadingScreen";

function ConsultationType() {
  const { data: session } = useSession();
  const { data: user } = session as Session;
  const router = useRouter();
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const [rows, setRows] = useState<ConsultationReasonModel[]>([]);
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState<any>();
  const { direction } = useAppSelector(configSelector);
  const { data, error, mutate } = useRequest({
    method: "GET",
    url:
      "/api/medical-entity/" +
      medical_entity.uuid +
      "/appointments/types/" +
      router.locale,
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });

  useEffect(() => {
    if (data !== undefined) {
      setRows((data as any).data);
    }
  }, [data]);

  const closeDraw = () => {
    setEdit(false);
  };

  const { t, ready } = useTranslation(["settings", "common"], {
    keyPrefix: "motifType.config",
  });
  if (!ready)
    return (
      <LoadingScreen
        error
        button={"loading-error-404-reset"}
        text={"loading-error"}
      />
    );

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
      id: "empty_1",
      numeric: false,
      disablePadding: true,
      label: "empty",
      align: "left",
      sortable: false,
    },
    {
      id: "empty_2",
      numeric: false,
      disablePadding: true,
      label: "empty",
      align: "left",
      sortable: false,
    },

    {
      id: "fees",
      numeric: false,
      disablePadding: true,
      label: "consultation_fees",
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

  const editMotif = (props: any) => {
    setEdit(true);
    setSelected(props);
  };
  return (
    <>
      <SubHeader>
        <Stack
          direction="row"
          justifyContent="space-between"
          width={1}
          alignItems="center">
          <Typography color="text.primary">{t("path")}</Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => editMotif(null)}
            sx={{ ml: "auto" }}>
            {t("add")}
          </Button>
        </Stack>
      </SubHeader>
      <DesktopContainer>
        <Box
          sx={{
            p: { xs: "40px 8px", sm: "30px 8px", md: 2 },
            "& table": { tableLayout: "fixed" },
          }}>
          <Otable
            headers={headCells}
            rows={rows}
            from={"consultation-type"}
            pagination={true}
            t={t}
            edit={editMotif}
          />
        </Box>
      </DesktopContainer>
      <MobileContainer>
        <Container>
          <Box pt={3.7}>
            {rows.map((row, idx) => (
              <React.Fragment key={idx}>
                <MotifTypeCard t={t} data={row} handleDrawer={editMotif} />
              </React.Fragment>
            ))}
          </Box>
        </Container>
      </MobileContainer>
      <Drawer anchor={"right"} open={edit} dir={direction} onClose={closeDraw}>
        <MotifTypeDialog
          data={selected}
          mutateEvent={mutate}
          closeDraw={closeDraw}
        />
      </Drawer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => ({
  props: {
    fallback: false,
    ...(await serverSideTranslations(context.locale as string, [
      "common",
      "menu",
      "patient",
      "settings",
    ])),
  },
});
export default ConsultationType;

ConsultationType.auth = true;

ConsultationType.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
