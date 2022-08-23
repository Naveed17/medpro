import React, {useEffect, useState} from 'react'
import { Stack, Typography, Box, CardContent, Select, MenuItem, FormHelperText, TextField } from "@mui/material";
import ConsultationDetailCardStyled from './overrides/consultationDetailCardStyle'
import Icon from "@themes/urlIcon";
import { useTranslation } from 'next-i18next'
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {ModelDot} from "@features/modelDot";

function CIPPatientHistoryCard() {
    const {data: session, status} = useSession();
    const loading = status === 'loading';
    const [cReason, setCReason] = useState<ConsultationReasonModel[]>([]);
    const {trigger} = useRequestMutation(null, "/consultation/", {revalidate: true, populateCache: false});
    let medical_entity: MedicalEntityModel | null = null;

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
            console.log('ok',values);
        },
    });

    useEffect(() => {
        if (medical_entity !== null) {
            trigger({
                method: "GET",
                url: "/api/medical-entity/" + medical_entity.uuid + "/consultation-reasons/",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, {revalidate: true, populateCache: true}).then(r => {
                if (r) setCReason((r.data as HttpResponse).data)
            });
        }
    }, [medical_entity, session?.accessToken, trigger]);
    const { handleSubmit, values, getFieldProps, errors, touched } = formik;
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })

    if (!ready || loading) return <>loading translations...</>;
    const {data: user} = session as Session;
    medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    return (
        <ConsultationDetailCardStyled>
            <Stack className="card-header" p={2} direction="row" alignItems="center" borderBottom={1} borderColor="divider">
                <Typography display='flex' alignItems="center" variant="body2" component="div" color="secondary" fontWeight={500}>
                    <Icon path='ic-edit-file-pen' />
                    {t("review")}
                </Typography>
            </Stack>
            <CardContent style={{padding: 20}}>
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
                                }>
                                {
                                    cReason.map(cr => (
                                        <MenuItem key={cr.uuid} value={cr.name}>
                                            <ModelDot color={cr.color} selected={false} size={21} sizedot={13}
                                                      padding={3} marginRight={15}></ModelDot>
                                            {cr.name}
                                        </MenuItem>
                                    ))
                                }

                            </Select>
                            {touched.motif && errors.motif && (
                                <FormHelperText error sx={{ px: 2 }}>
                                    {touched.motif && errors.motif}
                                </FormHelperText>
                            )}
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
                                <Typography component="span" color="error">*</Typography>
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