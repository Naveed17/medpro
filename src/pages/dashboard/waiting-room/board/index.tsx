import { GetStaticProps } from "next";
import React, { ReactElement } from "react";
//components
import { WaitingRoomDataTable } from "@features/waitingRoomDataTable";
import { Label } from "@features/label";
import Icon from "@themes/urlIcon";
// next-i18next
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import DashLayout from "@features/base/dashLayout";
import { Box } from "@mui/material";
import SubHeader from "@features/subHeader/components/subHeader";
import RoomToolbar from "@features/roomToolbar/components/roomToolbar";

function Board() {
    const { t, ready } = useTranslation('waitingRoom');
    if (!ready) return (<>loading translations...</>);

    return (
        <>
            <SubHeader>
                <RoomToolbar />
            </SubHeader>
            <Box bgcolor="#F0FAFF"
                sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>

            </Box>
        </>
    );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['waitingRoom']))
    }
})
export default Board;
Board.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

