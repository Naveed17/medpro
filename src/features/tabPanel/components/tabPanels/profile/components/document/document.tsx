import React, { useState } from "react";
import { Box, Typography, Button, Fab, LinearProgress } from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { InputStyled } from "@features/tabPanel";
import { useTranslation } from "next-i18next";

function Document() {
    const [file, setfile] = useState<File>();
    const [progress, setprogress] = useState(0);

    const { t, ready } = useTranslation('editProfile', { keyPrefix: "steppers.stepper-1" });
    if (!ready) return (<>loading translations...</>);

    return (
        <Box>
            <Typography variant="h6" color="text.primary" mb={10}>
                {t('title')}
            </Typography>
            <Box
                sx={{
                    textAlign: "center",
                    "& .file": {
                        width: 84,
                        height: 84,
                        path: { fill: theme => theme.palette.grey["A300"] },
                        "& .last": { stroke: theme => theme.palette.grey["A300"] },
                    },
                }}
            >
                <IconUrl path="ic-doc" />
                <Typography variant="body1" my={1} color="text.primary">
                    {t('sub-title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('desc')}
                </Typography>
                {file && (
                    <Box
                        sx={{
                            maxWidth: 358,
                            width: "100%",
                            display: "flex",
                            mx: "auto",
                            mt: 2,
                        }}
                    >
                        <IconUrl path="pdf-preview" />

                        <Box sx={{ width: "100%", ml: 1 }}>
                            <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 0.5,
                                    textTransform: "uppercase",
                                }}
                            >
                                {file.name}
                                <Typography variant="body2" color="text.secondary">
                                    {file.size / 1000} KB
                                </Typography>
                            </Typography>
                            <LinearProgress
                                value={progress}
                                variant="determinate"
                                color="success"
                                sx={{ bgcolor: theme => theme.palette.divider, borderRadius: "4px" }}
                            />
                        </Box>
                    </Box>
                )}

                <label htmlFor="contained-button-file">
                    <InputStyled
                        accept="application/pdf"
                        id="contained-button-file"
                        multiple={false}
                        type="file"
                        onChange={(e: any) => {
                            setfile(e.target.files[0] as File);
                            setprogress(100);
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        component="span"
                        startIcon={<IconUrl path="upload-pdf" />}
                    >
                        {t('upload')}
                    </Button>
                </label>
            </Box>
            <Fab
                color="primary"
                sx={{
                    boxShadow: theme => theme.customShadows.fab1,
                    position: "fixed",
                    bottom: "1rem",
                    right: "1rem",
                }}
            >
                <IconUrl path="robot" />
            </Fab>
        </Box>
    )
}

export default Document;
