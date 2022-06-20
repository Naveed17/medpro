import { GetStaticProps } from "next";
import { ReactElement } from "react";
// next-i18next
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { DashLayout } from "@features/base";
import { Box } from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { RoomToolbar } from "@features/roomToolbar";

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

