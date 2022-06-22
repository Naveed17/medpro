import { GetStaticProps } from "next";
import { ReactElement, useState, useEffect } from "react";
// next-i18next
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { DashLayout } from "@features/base";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { CollapseCard } from "@features/collapseCard";
import { RoomToolbar } from "@features/roomToolbar";
import { data } from '@features/collapseCard';
import { DetailsCard } from '@features/waitingRoom';

function Board() {
    const { t, ready } = useTranslation('waitingRoom');
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const [open, setopen] = useState<number[]>([]);
    const [mobileCollapse, setmobileCollapse] = useState(0);

    useEffect(() => {
        setopen(data.map(item => item.id));
    }, [data]);

    const handleClick: (id: number) => void = (id) => {
        setopen(open.includes(id) ? open.filter((item: number) => item !== id) : [...open, id]);
    }
    if (!ready) return (<>loading translations...</>);

    return (
        <>
            <SubHeader>
                <RoomToolbar board data={data} handleCollapse={(v: number) => setmobileCollapse(v)} />
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
                    {(isMobile ? data.filter(item => item.id === mobileCollapse) : data).map((item, index) => (
                        <CollapseCard
                            key={Math.random()}
                            translate={
                                {
                                    t: t,
                                    ready: ready,
                                }
                            }
                            index={index}
                            data={item}
                            open={open}
                            onClickAction={(id: number) => handleClick(id)}
                            mobileCollapse={mobileCollapse}
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

