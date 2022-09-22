import React, {useEffect, useState} from 'react'
import {Stack, Typography, Box, CardContent, Select, MenuItem, TextField} from "@mui/material";
import ConsultationDetailCardStyled from './overrides/consultationDetailCardStyle'
import Icon from "@themes/urlIcon";
import {useTranslation} from 'next-i18next'
import {ModelDot} from "@features/modelDot";

function CIPPatientHistoryCard({...props}) {
    const {exam, selectedExam, setSelectedExam} = props
    const [cReason, setCReason] = useState<ConsultationReasonModel[]>([]);

    useEffect(() => {
        setCReason(exam?.consultation_reasons)
    }, [exam]);


    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    if (!ready) return <>loading translations...</>;
    return (
        <ConsultationDetailCardStyled>
            <Stack className="card-header" p={2} direction="row" alignItems="center" borderBottom={1}
                   borderColor="divider">
                <Typography display='flex' alignItems="center" variant="body2" component="div" color="secondary"
                            fontWeight={500}>
                    <Icon path='ic-edit-file-pen'/>
                    {t("review")}
                </Typography>
            </Stack>
            <CardContent style={{padding: 20}}>
                <Stack spacing={2}>
                    <Box width={1}>
                        <Typography variant="body2" color="textSecondary" paddingBottom={1} fontWeight={500}>
                            {t("reason_for_consultation")}
                        </Typography>
                        <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id={"motif"}
                            size="small"
                            value={selectedExam.motif}
                            onChange={(ev) => {
                                console.log(ev.target.value)
                                selectedExam.motif = ev.target.value
                                setSelectedExam({...selectedExam})
                            }}
                            displayEmpty={true}
                            sx={{color: "text.secondary"}}
                            renderValue={(value) =>
                                value?.length
                                    ? Array.isArray(value)
                                        ? value.join(", ")
                                        : value
                                    : t("check")
                            }>
                            {
                                cReason?.map(cr => (
                                    <MenuItem key={cr.uuid} value={cr.uuid}>
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
                            value={selectedExam.notes}
                            onChange={(ev) => {
                                selectedExam.notes = ev.target.value
                                setSelectedExam({...selectedExam})
                            }}
                            placeholder={t("hint_text")}
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
                            onChange={(ev) => {
                                selectedExam.diagnosis = ev.target.value
                                setSelectedExam({...selectedExam})
                            }}
                            value={selectedExam.diagnosis}
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
                            value={selectedExam.treatment}
                            onChange={(ev) => {
                                selectedExam.treatment = ev.target.value
                                setSelectedExam({...selectedExam})
                            }}
                            placeholder={t("enter_your_dosage")}
                        />
                    </Box>
                </Stack>
            </CardContent>
        </ConsultationDetailCardStyled>
    )
}

export default CIPPatientHistoryCard