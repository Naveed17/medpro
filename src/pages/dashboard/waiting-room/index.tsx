import { GetStaticProps } from "next";
import React, { ReactElement } from "react";
//components
import { DetailsCard } from "@features/detailsCard";
import { Label } from "@features/label";
import Icon from "@themes/urlIcon";
// next-i18next
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { DashLayout } from "@features/base";
import { Box, Stack } from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { RoomToolbar } from "@features/toolbar";
import { Otable } from "@features/table";
export const rows = [
  {
    id: "#1",
    reson: "1st consultation",
    arrivaltime: '3:00',
    appointmentTime: '3:30',
    duration: '30',
    type: 'cabinet',
    status: "completed",
    patient: "John Doe",
    agenda: "Agenda cabinet",

  },
  {
    id: "#2",
    reson: "1st consultation",
    arrivaltime: '3:00',
    appointmentTime: '3:30',
    duration: '30',
    type: 'teleconsultation',
    status: "canceled",
    patient: "John Doe",
    agenda: "Agenda cabinet",

  },

];
export const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Id',
    align: 'left',
    sortable: true,
  },
  {
    id: 'arrivaltime',
    numeric: false,
    disablePadding: true,
    label: "arrival time",
    align: 'left',
    sortable: true,
  },
  {
    id: 'appointmentTime',
    numeric: false,
    disablePadding: true,
    label: "Appointment time",
    align: 'left',
    sortable: false,
  },
  {
    id: 'motif',
    numeric: false,
    disablePadding: true,
    label: "Reason",
    align: 'left',
    sortable: false,
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: "Status",
    align: 'left',
    sortable: true,
  },
  {
    id: 'patient',
    numeric: false,
    disablePadding: true,
    label: "Patient's name",
    align: 'left',
    sortable: true,
  },
  {
    id: 'agenda',
    numeric: false,
    disablePadding: true,
    label: "Agenda",
    align: 'left',
    sortable: true,
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: true,
    label: "Action",
    align: 'left',
    sortable: false,
  },

];
function Room() {
  const { t, ready } = useTranslation('waitingRoom', { keyPrefix: 'table' });
  if (!ready) return (<>loading translations...</>);

  return (
    <>
      <SubHeader>
        <RoomToolbar />
      </SubHeader>
      <Box bgcolor="#F0FAFF"
        sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>
        <Label
          variant="filled"
          color="success"
          sx={{
            color: theme => theme.palette.text.primary,
            svg: {
              mr: 1,
              width: 14,
              height: 14,
            },
          }}
        >
          <Icon path="ic-doc" />
          {t('room')}
        </Label>
        <Box display={{ xs: 'none', sm: 'block' }} mt={1}>
          <Otable headers={headCells}
            rows={rows}
            state={null}
            from={'waitingRoom'}
            t={t}
          />
        </Box>
        <Stack spacing={1} mt={2} display={{ xs: 'flex', sm: 'none' }}>
          <DetailsCard rows={rows} />
        </Stack>
      </Box>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['menu', 'common', 'waitingRoom']))
  }
})

export default Room;

Room.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashLayout>
      {page}
    </DashLayout>
  )
}

