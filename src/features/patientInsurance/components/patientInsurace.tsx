import React, { useState } from 'react';
import InsuranceStyled from "@features/patientInsurance/components/overrides/insuranceStyled";
import { Box, Collapse, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { NoDataCard } from "@features/card";
import AddIcon from "@mui/icons-material/Add";
import AddInsurance from "@features/patientInsurance/components/addInsurance";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CardInsurance from "@features/patientInsurance/components/cardInsurance";
import { useTranslation } from "next-i18next";
import { prepareInsurancesData } from "@lib/hooks";
import { useRequestQueryMutation } from "@lib/axios";
import { useRouter } from "next/router";

const PatientInsurance = ({ ...props }) => {
    const { patientInsurances, mutatePatientInsurances, patient, urlMedicalEntitySuffix, medicalEntityHasUser } = props;

    const { t } = useTranslation(["patient", "common"]);
    const { trigger: triggerPatientUpdate } = useRequestQueryMutation("/patient/update");
    const { trigger: triggerDelete } = useRequestQueryMutation("/insurance/delete");
    const router = useRouter();
    const theme = useTheme()
    const noAppData = {
        mainIcon: "ic-assurance",
        title: "insurance.noInsurance",
        description: "insurance.addInsurance"
    };

    const [addNew, setAddNew] = useState(false);
    const [selectedInsurance, setSelectedInsurance] = useState("");


    const handleUpdatePatient = ({ ...props }) => {
        const {
            values,
            selectedBox,
            apcis,
            contacts,
            selectedConv,
            requestAction,
            setSelected,
            setSelectedConv,
            resetForm,
            pi
        } = props

        const params = new FormData();
        params.append('insurance', JSON.stringify(prepareInsurancesData({
            insurances: [{
                ...values.insurance, box: selectedBox ? selectedBox.uuid : "",
                apcis, contact: contacts?.length > 0 && contacts[0].uuid, medical_entity_has_insurance: selectedConv ? selectedConv.uuid : ""
            }],
        })[0]));

        medicalEntityHasUser && triggerPatientUpdate({
            method: requestAction,
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/insurances/${requestAction === "PUT" ? `${pi.uuid}/` : ""}${router.locale}`,
            data: params
        }, {
            onSuccess: () => {
                setAddNew(false)
                setSelected(null);
                setSelectedConv(null)
                resetForm();
                setSelectedInsurance && setSelectedInsurance("");
                mutatePatientInsurances && mutatePatientInsurances();
            }
        })
    }

    const deleteInsurance = (uuid: string) => {
        medicalEntityHasUser && triggerDelete({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/insurances/${uuid}/${router.locale}`,
        }, {
            onSuccess: () => {
                mutatePatientInsurances && mutatePatientInsurances();
            }
        })
    }

    return (
        <InsuranceStyled spacing={1}>
            <Stack pl={2} direction={"row"} justifyContent={"space-between"} alignItems={"center"} pt={2} pb={1}>
                <Typography color={theme.palette.grey[900]} variant='subtitle1' fontWeight={600} fontSize={18}>{t('insurance.agreement')}</Typography>
                <IconButton
                    onClick={() => setAddNew(!addNew)}
                    color={"success"}
                    className="success-light"
                    sx={{
                        mr: 1.5,
                        "& svg": {
                            width: 20,
                            height: 20,
                        },
                    }}>
                    {addNew ? <CloseRoundedIcon /> : <AddIcon />}
                </IconButton>
            </Stack>
            <Collapse in={addNew}>
                <Box className={"insurance-box"}>
                    {addNew && <AddInsurance {...{ handleUpdatePatient }} />}
                </Box>
            </Collapse>

            {patientInsurances?.map((pi: any) => (
                <Box key={pi.uuid} className={"insurance-box"}>
                    <Collapse in={selectedInsurance !== pi.insurance.uuid}>
                        <CardInsurance {...{
                            pi, t, setSelectedInsurance, deleteInsurance
                        }} />
                    </Collapse>
                    <Collapse in={selectedInsurance === pi.insurance.uuid}>
                        {
                            selectedInsurance === pi.insurance.uuid &&
                            <AddInsurance {...{ handleUpdatePatient, pi, requestAction: "PUT" }} />
                        }
                    </Collapse>
                </Box>
            ))}

            <Collapse in={!addNew && patientInsurances?.length === 0}>
                {patientInsurances?.length === 0 && <Stack justifyContent={"center"}>
                    <NoDataCard t={t} ns={"patient"} data={noAppData} />
                </Stack>}
            </Collapse>
        </InsuranceStyled>
    );
}

export default PatientInsurance;
