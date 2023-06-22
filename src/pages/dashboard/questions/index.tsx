import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState, useEffect, useRef } from "react";
import {
    Box,
    IconButton,
    Typography,
    Card,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Stack,
    Button
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashLayout from "@features/base/components/dashLayout/dashLayout";
import { Label } from "@features/label";
import { QuestionCard } from '@features/card'
import { DrawerBottom } from '@features/drawerBottom';
import { Questions as QuestionFilter } from '@features/leftActionBar'
import { useAppSelector } from "@lib/redux/hooks";
import { qsSidebarSelector } from "@features/leftActionBar";
import Icon from "@themes/urlIcon";
import {LoadingScreen} from "@features/loadingScreen";
function Questions() {
    const { qs } = useAppSelector(qsSidebarSelector);
    const { t, ready } = useTranslation('questions');
    const ref = useRef<HTMLDivElement>(null);
    const [offsetTop, setOffsetTop] = useState(0);
    const [drawer, setDrawer] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (ref.current) {
            setOffsetTop(ref.current.offsetTop);
        }
        return () => {
            setOffsetTop(0);
        }
    }, []);
    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

    return (
        <>
            <Box className="container">
                <Typography color="textPrimary">{qs?.question}</Typography>
                <Typography variant="body2" color="textSecondary">
                    {qs?.date}
                </Typography>
                <Label
                    sx={{
                        color: theme.palette.common.white,
                        backgroundColor: theme.palette.grey[400],
                        mt: 1.5,
                    }}
                    color="secondary"
                    variant="filled"
                >
                    {t(qs?.category)}
                </Label>
                <Stack sx={{
                    height: { xl: `calc(100vh - ${offsetTop + 180}px)`, xs: '100%' },

                }}>
                    <QuestionCard patientData={qs?.patient} t={t} />
                    <Box mt='auto'>
                        <Typography
                            variant="subtitle2"
                            color={theme.palette.primary.main}
                            fontFamily="Poppins-SemiBold"
                            textTransform="capitalize"
                        >
                            {t("answers")}
                        </Typography>
                        <Card sx={{ border: 1, borderColor: theme.palette.grey[100], boxShadow: "none" }}>
                            <TextField
                                id="outlined-multiline-static"
                                placeholder={t("write_answer")}
                                value={qs?.reply ? qs?.reply.reply : ''}
                                multiline
                                rows={6}
                                fullWidth
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        background: "transparent",
                                        "& fieldset": {
                                            border: "0 !important",
                                            boxShadow: "none !important",
                                        },
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    backgroundColor: theme.palette.grey[100],
                                    border: 0.5,
                                    borderColor: "divider",
                                    borderRadius: "0px 0px 10px 10px",
                                    px: 2,
                                    py: 0.5,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <FormGroup>
                                    <FormControlLabel
                                        sx={{ color: theme.palette.grey[500] }}
                                        control={<Checkbox defaultChecked />}
                                        label={t("publish")}
                                    />
                                </FormGroup>
                                <IconButton sx={{ ml: "auto", p: "4px" }}>
                                    <Icon path="ic-send" />
                                </IconButton>
                            </Box>
                        </Card>
                    </Box>
                </Stack>
            </Box>
            <Button
                startIcon={<Icon path="ic-filter" />}
                variant="filter"
                onClick={() => setDrawer(!drawer)}
                sx={{ position: 'fixed', bottom: 50, transform: 'translateX(-50%)', left: '50%', zIndex: 999, display: { xs: 'flex', md: 'none' } }}
            >
                Filtrer (0)
            </Button>
            <DrawerBottom
                handleClose={() => setDrawer(false)}
                open={drawer}
                title={null}
            >
                <QuestionFilter />
            </DrawerBottom>
        </>
    )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'questions']))
    }
})
export default Questions

Questions.auth = true;

Questions.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
