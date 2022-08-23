import React from 'react'
import { Stack, Typography, Box, CardContent, Select, MenuItem, FormHelperText, TextField } from "@mui/material";
import ConsultationDetailCardStyled from './overrides/consultationDetailCardStyle'
import Icon from "@themes/urlIcon";
import { useTranslation } from 'next-i18next'
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

function CIPPatientHistoryCard() {
    const RegisterSchema = Yup.object().shape({
        motif: Yup.string().required("Motif is required"),
    });
    const formik = useFormik({
        initialValues: {
            motif: "",
            notes: "",
            diagnosis: "",
            treatment: "",
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values) => {
        },
    });
    const { handleSubmit, values, getFieldProps, errors, touched } = formik;
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    if (!ready) return <>loading translations...</>;
    return (
        <ConsultationDetailCardStyled>
            <Stack className="card-header" p={2} direction="row" alignItems="center" borderBottom={1} borderColor="divider">
                <Typography display='flex' alignItems="center" variant="body2" component="div" color="secondary" fontWeight={500}>
                    <Icon path='ic-edit-file-pen' />
                    {t("review")}
                </Typography>
            </Stack>
            <CardContent>
                <FormikProvider value={formik}>
                    <Stack
                        spacing={2}
                        component={Form}
                        autoComplete="off"
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <Box width={1}>
                            <Typography variant="body2" color="textSecondary" fontWeight={500}>
                                {t("reason_for_consultation")}
                                <Typography component="span" color="error">*</Typography>
                            </Typography>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id={"motif"}
                                size="small"
                                {...getFieldProps("motif")}
                                value={values.motif}
                                displayEmpty={true}
                                sx={{ color: "text.secondary" }}
                                renderValue={(value) =>
                                    value?.length
                                        ? Array.isArray(value)
                                            ? value.join(", ")
                                            : value
                                        : t("check")
                                }
                            >
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                            </Select>
                            {touched.motif && errors.motif && (
                                <FormHelperText error sx={{ px: 2 }}>
                                    {touched.motif && errors.motif}
                                </FormHelperText>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="textSecondary" fontWeight={500}>
                                {t("notes")}
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={9}
                                placeholder={t("hint_text")}
                                {...getFieldProps("notes")}
                            />
                        </Box>
                        <Box width={1}>
                            <Typography variant="body2" color="textSecondary" fontWeight={500}>
                                {t("diagnosis")}
                                <Typography component="span" color="error">*</Typography>
                            </Typography>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id={"diagnosis"}
                                size="small"
                                {...getFieldProps("diagnosis")}
                                value={values.diagnosis}
                                displayEmpty={true}
                                sx={{ color: "text.secondary" }}
                                renderValue={(value) =>
                                    value?.length
                                        ? Array.isArray(value)
                                            ? value.join(", ")
                                            : value
                                        : t("check")
                                }
                            >
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                            </Select>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="textSecondary" fontWeight={500}>
                                {t("treatment")}
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                placeholder={t("enter_your_dosage")}
                                {...getFieldProps("treatment")}
                            />
                        </Box>
                    </Stack>
                </FormikProvider>
            </CardContent>
        </ConsultationDetailCardStyled>
    )
}

export default CIPPatientHistoryCard