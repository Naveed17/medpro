// react
import { useEffect, useState, ReactElement } from "react";

// next
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { Session } from "next-auth";

// material components
import { Box, Drawer, Zoom } from "@mui/material";

// redux
import { useAppSelector, useAppDispatch } from "@app/redux/hooks";
import { tableActionSelector } from "@features/table";
import { configSelector } from "@features/base";
import { onOpenPatientDrawer } from "@features/table";

// ________________________________
import { PatientMobileCard } from "@features/patientMobileCard";
import { Otable } from "@features/table";
import { SubHeader } from "@features/subHeader";
import { PatientToolbar } from "@features/toolbar";
import { DashLayout } from "@features/base";
import { CustomStepper } from "@features/customStepper";
import { useRequest } from "@app/axios";

// icons
import { AddRDVStep1, AddRDVStep2, AddRDVStep3 } from "@features/tabPanel";
import { SWRNoValidateConfig } from "@app/swr/swrProvider";
import { PatientDetail } from "@features/dialog";

const stepperData = [
  {
    title: "tabs.time-slot",
    children: AddRDVStep1,
  },
  {
    title: "tabs.advice",
    children: AddRDVStep2,
  },
  {
    title: "tabs.end",
    children: AddRDVStep3,
  },
];

// interface
interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
  align: "left" | "right" | "center";
}

// table head data
const headCells: readonly HeadCell[] = [
  {
    id: "select-all",
    numeric: false,
    disablePadding: true,
    label: "checkbox",
    sortable: false,
    align: "left",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "name",
    sortable: true,
    align: "left",
  },
  {
    id: "telephone",
    numeric: true,
    disablePadding: false,
    label: "telephone",
    sortable: true,
    align: "left",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "city",
    sortable: true,
    align: "left",
  },
  {
    id: "nextAppointment",
    numeric: false,
    disablePadding: false,
    label: "nextAppointment",
    sortable: false,
    align: "left",
  },
  {
    id: "lastAppointment",
    numeric: false,
    disablePadding: false,
    label: "lastAppointment",
    sortable: false,
    align: "left",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "action",
    sortable: false,
    align: "right",
  },
];
function Patient() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const router = useRouter();

  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;

  const {
    data: httpPatientsResponse,
    error: errorHttpPatients,
    mutate,
  } = useRequest(
    {
      method: "GET",
      url: `/api/medical-entity/${medical_entity.uuid}/patients/${
        router.locale
      }?page=${router.query.page || 1}&limit=10&withPagination=true`,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    },
    SWRNoValidateConfig
  );

  // selectors
  const { patientId, patientAction } = useAppSelector(tableActionSelector);
  const { direction } = useAppSelector(configSelector);

  // state hook for details drawer
  const [open, setopen] = useState<boolean>(false);
  const [isAddAppointment, setAddAppointment] = useState<boolean>(false);

  // useEffect hook for handling the table action drawer
  useEffect(() => {
    if (patientId && patientAction === "PATIENT_DETAILS") {
      setopen(true);
    }
  }, [patientId, patientAction]);

  const selectedPatient =
    patientAction === "EDIT_PATIENT"
      ? (httpPatientsResponse as HttpResponse)?.data?.list.filter(
          (val: any) => val.uuid === patientId
        )[0]
      : "";

  const { t, ready } = useTranslation("patient", { keyPrefix: "config" });

  if (!ready) return <>loading translations...</>;

  return (
    <>
      <SubHeader>
        <PatientToolbar
          onAddPatient={() => mutate()}
          selectedPatient={selectedPatient}
        />
      </SubHeader>
      <Box className="container">
        <Box display={{ xs: "none", md: "block" }}>
          <Otable
            headers={headCells}
            rows={(httpPatientsResponse as HttpResponse)?.data?.list}
            state={null}
            from={"patient"}
            t={t}
            edit={null}
            handleConfig={null}
            handleChange={null}
            minWidth={1100}
            pagination
            total={(httpPatientsResponse as HttpResponse)?.data?.total}
            totalPages={
              (httpPatientsResponse as HttpResponse)?.data?.totalPages
            }
            loading={!Boolean(httpPatientsResponse)}
          />
        </Box>
        <PatientMobileCard
          ready={ready}
          PatiendData={(httpPatientsResponse as HttpResponse)?.data?.list}
          loading={!Boolean(httpPatientsResponse)}
        />
        <Drawer
          anchor={"right"}
          open={open}
          dir={direction}
          onClose={() => {
            dispatch(onOpenPatientDrawer({ patientId: "" }));
            setopen(false);
          }}
        >
          {!isAddAppointment && (
            <PatientDetail
              onCloseDialog={() => {
                dispatch(onOpenPatientDrawer({ patientId: "" }));
                setopen(false);
              }}
              onChangeStepper={(index: number) =>
                console.log("onChangeStepper", index)
              }
              onAddAppointment={() => console.log("onAddAppointment")}
              ConsultationId=""
              patientId={patientId}
            />
          )}
          <Zoom in={isAddAppointment}>
            <Box
              height={isAddAppointment ? "100%" : 0}
              sx={{
                "& .MuiTabs-root": {
                  position: "sticky",
                  top: 0,
                  bgcolor: (theme) => theme.palette.background.paper,
                  zIndex: 11,
                },
              }}
            >
              <CustomStepper
                currentIndex={0}
                stepperData={stepperData}
                scroll
                t={t}
                minWidth={726}
                onClickCancel={() => setAddAppointment(false)}
              />
            </Box>
          </Zoom>
        </Drawer>
      </Box>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    fallback: false,
    ...(await serverSideTranslations(locale as string, [
      "patient",
      "menu",
      "common",
    ])),
  },
});

export default Patient;
Patient.auth = true;
Patient.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
