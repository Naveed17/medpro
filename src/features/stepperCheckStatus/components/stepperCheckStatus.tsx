import {
    Typography,
    Box,
    Container,
    Button,
    IconButton,
    Fab,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import React from "react";

function StepperCheckStatus({ doctor }: any) {

    const { t, ready } = useTranslation('editProfile', { keyPrefix: 'steppers.check-status' });
    if (!ready) return (<>loading translations...</>);

    return (
        <Box p={2} sx={{ textAlign: "center", pt: 1 }}>
            <IconUrl path="loading" />
            <Typography variant="h5" my={2} color="text.primary">
                {t('title')}
            </Typography>
            <Typography variant="h6" color="text.primary" fontFamily="Poppins-Bold">
                {doctor.name} !{" "}
                <IconButton sx={{ path: { fill: "#1B2746" } }} size="small">
                    <IconUrl path="ic-edit" />
                </IconButton>
            </Typography>
            <Typography variant="body1" color="text.primary" mb={4}>
                {doctor.email}
            </Typography>
            <Container maxWidth="md">
                <Typography variant="body1" color="text.primary">
                    {t('desc')}
                </Typography>
            </Container>
            <Typography variant="body1" color="text.primary" sx={{ mt: 3, mb: 0.5 }}>
                {t('contact')}
            </Typography>
            <Typography variant="body1" color="text.primary">
                {" "}
                {t('phone')} : +21653434404
            </Typography>
            <Typography variant="body1" color="text.primary">
                {t('email')} : contact@med.tn
            </Typography>
            <Typography variant="body1" color="text.primary" mt={3}>
                {t('edit-data')}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 1.5, mb: 5, maxWidth: 390 }}
                fullWidth
            >
                {t('accept')}
            </Button>
            <Fab
                color="primary"
                sx={{
                    boxShadow: "0px 2px 20px rgba(156, 155, 155, 0.46);",
                    position: "fixed",
                    bottom: "1rem",
                    right: "1rem",
                }}
            >
                <IconUrl path="robot" />
            </Fab>
        </Box>
  );
}

export default StepperCheckStatus;
