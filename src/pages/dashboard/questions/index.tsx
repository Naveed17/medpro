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

} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashLayout from "@features/base/components/dashLayout/dashLayout";
import { Label } from "@features/label";
import { QuestionCard } from '@features/card'
import Icon from "@themes/urlIcon";
export const questions = {
    title: 'White spots on the teeth',
    date: 'December 12, 2020',
    category: 'Category 1',
    patientData: {
        illness: "The pain itself is the love That's why'",
        countary: 'tn',
        city: 'The Bardo Tunis',
        height: "174 cm",
        weight: "60 kg",
        medicalBackground: 'The pain itself is the love',
        medicalTreatments: 'The pain itself is the love'
    }
}

function Questions() {
    const { t, ready } = useTranslation('common');
    const ref = useRef<HTMLDivElement>(null);
    const [offsetTop, setOffsetTop] = useState(0);
    const theme = useTheme();
    const { title, date, category, patientData } = questions;
    useEffect(() => {
        if (ref.current) {
            setOffsetTop(ref.current.offsetTop);
        }
        return () => {
            setOffsetTop(0);
        }
    }, []);
    if (!ready) return (<>loading translations...</>);

    return (

        <Box className="container">
            <Typography color="textPrimary">{title}</Typography>
            <Typography variant="body2" color="textSecondary">
                {date}
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
                {category}
            </Label>
            <Stack sx={{
                height: { sm: `calc(100vh - ${offsetTop + 180}px)`, xs: '100%' },

            }}>
                <QuestionCard patientData={patientData} />
                <Box mt='auto'>
                    <Typography
                        variant="subtitle2"
                        color={theme.palette.primary.main}
                        fontFamily="Poppins-SemiBold"
                    >
                        Answers
                    </Typography>
                    <Card sx={{ border: 1, borderColor: theme.palette.grey[100], boxShadow: "none" }}>
                        <TextField
                            id="outlined-multiline-static"
                            placeholder="Write your answer here"
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
                                    label="Publish my answer on Med.tn"
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

    )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'agenda']))
    }
})
export default Questions

Questions.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
