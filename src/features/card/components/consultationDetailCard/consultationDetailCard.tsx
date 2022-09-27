import React, { useEffect, useState } from 'react'
import { Stack, Typography, Box, CardContent, Select, MenuItem, TextField } from "@mui/material";
import ConsultationDetailCardStyled from './overrides/consultationDetailCardStyle'
import Icon from "@themes/urlIcon";
import { useTranslation } from 'next-i18next'
import { useFormik, Form, FormikProvider } from "formik";
import { ModelDot } from "@features/modelDot";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { SetExam } from "@features/toolbar/components/consultationIPToolbar/actions";
import { consultationSelector } from "@features/toolbar";

function CIPPatientHistoryCard({ ...props }) {
    const { exam: defaultExam } = props
    const { exam } = useAppSelector(consultationSelector);
    const [cReason, setCReason] = useState<ConsultationReasonModel[]>([]);
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            motif: exam.motif,
            notes: exam.notes,
            diagnosis: exam.diagnosis,
            treatment: exam.treatment,
        },
        onSubmit: async (values) => {
            console.log('ok', values);
        },
    });

    useEffect(() => {
        setCReason(defaultExam?.consultation_reasons)
    }, [defaultExam]);

    const { handleSubmit, values, getFieldProps } = formik;

    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })

    if (!ready) return <>loading translations...</>;
    return (
        <ConsultationDetailCardStyled>
            <Stack className="card-header" p={2} direction="row" alignItems="center" borderBottom={1}
                borderColor="divider">
                <Typography display='flex' alignItems="center" variant="body2" component="div" color="secondary"
                    fontWeight={500}>
                    <Icon path='ic-edit-file-pen' />
                    {t("review")}
                </Typography>
            </Stack>
            <CardContent style={{ padding: 20 }}>
                <button hidden={true} className={'sub-exam'} onClick={() => {
                    dispatch(SetExam(values))
                }}></button>
                <FormikProvider value={formik}>
                    <Stack
                        spacing={2}
                        component={Form}
                        autoComplete="off"
                        noValidate
                        onSubmit={handleSubmit}>
                        <Box width={1}>
                            <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
                                {t("reason_for_consultation")}
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
                                        : '--'
                                }>
                                {
                                    cReason?.map(cr => (
                                        <MenuItem key={cr.uuid} value={cr.name}>
                                            <ModelDot color={cr.color} selected={false} size={21} sizedot={13}
                                                padding={3} marginRight={15}></ModelDot>
                                            {cr.name}
                                        </MenuItem>
                                    ))
                                }

                            </Select>

                        </Box>
                        <Box>
                            <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
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
                            <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
                                {t("diagnosis")}
                            </Typography>
                            <TextField
                                fullWidth
                                id={"diagnosis"}
                                size="small"
                                {...getFieldProps("diagnosis")}
                                value={values.diagnosis}
                                sx={{ color: "text.secondary" }}>

                            </TextField>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
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