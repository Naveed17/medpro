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
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
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
  const theme: Theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session } = useSession();
  const { data: user } = session as Session;
  const router = useRouter();
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const [rows, setRows] = useState<ConsultationReasonModel[]>([]);
  const [displayedItems, setDisplayedItems] = useState(10);
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState<any>();
  const { direction } = useAppSelector(configSelector);
  const { data, error, mutate } = useRequest({
    method: "GET",
    url: `/api/medical-entity/${medical_entity.uuid}/appointments/types/${
      router.locale
    }${
      !isMobile
        ? `?page=${router.query.page || 1}&limit=10&withPagination=true`
        : ""
    }`,
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });
  const handleScroll = () => {
    const total = (data as HttpResponse)?.data.length;
    if (window.innerHeight + window.scrollY > document.body.offsetHeight - 50) {
      if (total > displayedItems) {
        setDisplayedItems(displayedItems + 10);
      }
      if (total - displayedItems < 10) {
        setDisplayedItems(total);
      }
    }
  };
  useEffect(() => {
    if (data !== undefined) {
      if (isMobile) {
        setRows((data as HttpResponse).data);
      } else {
        setRows((data as HttpResponse).data?.list);
      }
    }
  }, [data]);
  useEffect(() => {
    // Add scroll listener
    if (isMobile) {
      let promise = new Promise(function (resolve, reject) {
        document.body.style.overflow = "hidden";
        setTimeout(() => {
          resolve(window.addEventListener("scroll", handleScroll));
        }, 2000);
      });
      promise.then(() => {
        return (document.body.style.overflow = "visible");
      });

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [data, displayedItems]);
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
            pagination
            t={t}
            edit={editMotif}
            total={(data as HttpResponse)?.data?.total}
            totalPages={(data as HttpResponse)?.data?.totalPages}
          />
        </Box>
      </DesktopContainer>
      <MobileContainer>
        <Container>
          <Box pt={3.7}>
            {rows?.slice(0, displayedItems).map((row, idx) => (
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
