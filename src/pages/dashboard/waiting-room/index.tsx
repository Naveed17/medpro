import { GetStaticProps } from "next";
import React, { ReactElement } from "react";
//components
import { WaitingRoomDataTable } from "@features/waitingRoomDataTable";
import { Label } from "@features/label";
import Icon from "@themes/urlIcon";
// next-i18next
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { DashLayout } from "@features/base";
import { Box } from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { RoomToolbar } from "@features/roomToolbar";

function Room() {
  const { t, ready } = useTranslation('waitingRoom');
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
            color: "#000",
            svg: {
              mr: 1,
              width: 14,
              height: 14,
            },
          }}
        >
          <Icon path="ic-doc" />
          Salle 1
        </Label>
        <WaitingRoomDataTable />
      </Box>
    </>
  );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['waitingRoom', 'menu', 'common']))
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

