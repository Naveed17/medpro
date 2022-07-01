import React from 'react'
import {
    Box,
    Typography,
    Card,
    CardHeader,
    CardContent,
    List,
    ListItem,

} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import QuestionCardStyled from './overrides/questionStyle';
function QuestionCard({ patientData, t }: any) {
    const theme = useTheme();
    return (
        <QuestionCardStyled>
            <CardHeader
                subheader={patientData.illness}
            />
            <CardContent>
                <Box display="flex" alignItems="center">
                    <Box
                        component="img"
                        alt="Questions"
                        src={`https://flagcdn.com/w20/${patientData.countary}.png`}
                        width={23}
                        height={16}

                    />
                    <Typography
                        variant="subtitle2"
                        component="p"
                        fontWeight="400"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                    >
                        {patientData.city}
                    </Typography>
                </Box>
                <Box pl={4}>
                    <List className="nav">
                        <ListItem>
                            <Typography
                                color={theme.palette.secondary.main}
                                fontFamily="Poppins-Bold"
                                sx={{ mr: { lg: 8, xs: 5 } }}
                                textTransform="capitalize"
                            >
                                {t("height")}
                            </Typography>
                            <Typography color={theme.palette.secondary.main}>
                                {patientData.height}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography
                                color={theme.palette.secondary.main}
                                fontFamily="Poppins-Bold"
                                sx={{ mr: { lg: 8, xs: 5 } }}
                                textTransform="capitalize"
                            >
                                {t("weight")}
                            </Typography>
                            <Typography color={theme.palette.secondary.main}>
                                {patientData.weight}
                            </Typography>
                        </ListItem>
                    </List>
                    <List className="list">
                        <ListItem>
                            <Typography
                                color={theme.palette.secondary.main}
                                fontFamily="Poppins-Bold"
                            >
                                Medical background
                            </Typography>
                            <Typography color={theme.palette.secondary.main}>
                                {patientData.medicalBackground}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography
                                color={theme.palette.secondary.main}
                                fontFamily="Poppins-Bold"
                            >
                                Medical treatments
                            </Typography>
                            <Typography color={theme.palette.secondary.main}>
                                {patientData.medicalTreatments}
                            </Typography>
                        </ListItem>
                    </List>
                </Box>
            </CardContent>
        </QuestionCardStyled>
    )
}

export default QuestionCard