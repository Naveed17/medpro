import { GetStaticProps } from "next";
import { ReactElement, useState, useEffect } from "react";
// next-i18next
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { DashLayout } from "@features/base";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SubHeader } from "@features/subHeader";
import { CollapseCard } from "@features/collapseCard";
import { RoomToolbar } from "@features/roomToolbar";
import { data } from '@features/collapseCard/components/configs';
import { DetailsCard } from '@features/waitingRoom';
function Board() {
    const { t, ready } = useTranslation('waitingRoom');
    if (!ready) return (<>loading translations...</>);
    const [open, setopen] = useState([]);

    useEffect(() => {
        setopen(data.map(item => item.id));
    }, [data]);
    const handleClick: (id: number) => number[] = (id: number) => {
        setopen(open.includes(id) ? open.filter(item => item !== id) : [...open, id]);
    }
    return (
        <>
            <SubHeader>
                <RoomToolbar />
            </SubHeader>
            <Box bgcolor="#F0FAFF"
                sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        "& .MuiPaper-root:not(style)+:not(style)": {
                            ml: { md: 2, sm: 0, xs: 0 },
                        },
                    }}
                >
                    {data.map((item, index) => (
                        <CollapseCard
                            key={Math.random()}
                            index={index}
                            data={item}
                            open={open}
                            onClickAction={(id: number) => handleClick(id)}
                        >

                            {
                                open.includes(item.id) && (
                                    <>
                                        <DetailsCard />
                                        <DetailsCard />
                                        <DetailsCard />
                                        <DetailsCard />
                                        <DetailsCard />
                                        <DetailsCard />
                                        <DetailsCard />
                                        <DetailsCard />
                                    </>
                                )

                            }
                        </CollapseCard>
                    ))}
                </Stack>

            </Box>
        </>
    );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['waitingRoom', 'common', 'menu']))
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

