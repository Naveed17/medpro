import React, {useEffect, useState} from 'react'
import {Box, CardContent, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import ConsultationDetailCardStyled from './overrides/consultationDetailCardStyle'
import Icon from "@themes/urlIcon";
import {useTranslation} from 'next-i18next'
import {Form, FormikProvider, useFormik} from "formik";
import {ModelDot} from "@features/modelDot";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {SetExam} from "@features/toolbar/components/consultationIPToolbar/actions";
import {consultationSelector} from "@features/toolbar";
import {pxToRem} from "@themes/formatFontSize";
import {LoadingScreen} from "@features/loadingScreen";

function CIPPatientHistoryCard({...props}) {
    const {exam: defaultExam, changes, setChanges} = props
    const {exam} = useAppSelector(consultationSelector);
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

    const {handleSubmit, values, getFieldProps} = formik;


    useEffect(() => {
        const item = changes.find((change: { name: string }) => change.name === "fiche")
        item.checked = Object.values(values).filter(val => val !== '').length > 0;
        setChanges([...changes])
    }, [values])// eslint-disable-line react-hooks/exhaustive-deps

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);
    return (
        <ConsultationDetailCardStyled>
            <Stack className="card-header" padding={pxToRem(13)} direction="row" alignItems="center" borderBottom={1}
                   borderColor="divider">
                <Typography display='flex' alignItems="center" variant="body1" component="div" color="secondary"
                            fontWeight={600}>
                    <Icon path='ic-edit-file-pen'/>
                    {t("review")}
                </Typography>
            </Stack>
            <CardContent style={{padding: 20}}>
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
                                sx={{color: "text.secondary"}}
                                renderValue={selected => {
                                    if (selected.length === 0) {
                                        return <em>--</em>;
                                    }

                                    const creason = cReason?.find(cr => cr.uuid === selected);
                                    return (
                                        <Box sx={{display: "inline-flex"}}>

                                            <Typography>{creason?.name}</Typography>
                                        </Box>
                                    )
                                }}>
                                {
                                    cReason?.map(cr => (
                                        <MenuItem key={'xyq' + cr.uuid} value={cr.uuid}>
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
                                sx={{color: "text.secondary"}}>

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
