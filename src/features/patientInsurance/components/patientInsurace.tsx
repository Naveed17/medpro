import React, {useState} from 'react';
import InsuranceStyled from "@features/patientInsurance/components/overrides/insuranceStyled";
import {Box, Collapse, IconButton, Stack, Typography} from "@mui/material";
import {NoDataCard} from "@features/card";
import AddIcon from "@mui/icons-material/Add";
import AddInsurance from "@features/patientInsurance/components/addInsurance";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CardInsurance from "@features/patientInsurance/components/cardInsurance";
import {useTranslation} from "next-i18next";
import {prepareInsurancesData} from "@lib/hooks";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";

const PatientInsurance = ({...props}) => {
    const {patientInsurances, mutatePatientInsurances, patient, urlMedicalEntitySuffix, medicalEntityHasUser} = props;

    const {t} = useTranslation(["patient", "common"]);
    const {trigger: triggerPatientUpdate} = useRequestQueryMutation("/patient/update");
    const {trigger: triggerDelete} = useRequestQueryMutation("/insurance/delete");
    const router = useRouter();

    const noAppData = {
        mainIcon: "ic-assurance",
        title: "insurance.noInsurance",
        description: "insurance.addInsurance"
    };

    const [addNew, setAddNew] = useState(false);
    const [selectedInsurance, setSelectedInsurance] = useState("");


    const handleUpdatePatient = ({...props}) => {
        console.log(props)
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
            insurances: [{...values.insurance,box: selectedBox ? selectedBox.uuid : "",
                apcis,contact: contacts?.length > 0 && contacts[0].uuid,medical_entity_has_insurance: selectedConv ? selectedConv.uuid : ""}],
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

    const deleteInsurance = (uuid:string)=>{
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
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} pt={2} pb={1}>
                <Typography className={"title"}>{t('insurance.agreement')}</Typography>
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
                    {addNew ? <CloseRoundedIcon/> : <AddIcon/>}
                </IconButton>
            </Stack>

            <Collapse in={addNew}>
                <Box className={"insurance-box"}>
                    {addNew && <AddInsurance {...{handleUpdatePatient}}/>}
                </Box>
            </Collapse>

            {patientInsurances?.map((pi: any) => (
                <Box key={pi.uuid} className={"insurance-box"}>
                    <Collapse in={selectedInsurance !== pi.insurance.uuid}>
                        <CardInsurance {...{
                            pi,t, setSelectedInsurance,deleteInsurance
                        }}/>
                    </Collapse>
                    <Collapse in={selectedInsurance === pi.insurance.uuid}>
                        {
                            selectedInsurance === pi.insurance.uuid &&
                            <AddInsurance {...{handleUpdatePatient, pi, requestAction: "PUT"}}/>
                        }
                    </Collapse>
                </Box>
            ))}

            <Collapse in={!addNew && patientInsurances?.length === 0}>
                {patientInsurances?.length === 0 && <Stack justifyContent={"center"}>
                    <NoDataCard t={t} ns={"patient"} data={noAppData}/>
                </Stack>}
            </Collapse>
        </InsuranceStyled>
    );
}


export default PatientInsurance;
/*
{patientInsurances?.map((insurance: any, index: number) => (
    <Grid container key={`${index}-${insurance.uuid}`}>
        <Stack sx={{
            ...(index === 0 && {
                marginTop: 1
            }),
            width: "inherit"
        }} direction="row" alignItems="center">
            <Grid item md={12} sm={12} xs={12}>
                {loading ? (
                    <Skeleton variant="text"/>
                ) : (
                    <>
                        <Grid container spacing={1.2}>
                            <Grid item xs={6} md={3}>
                                {(() => {
                                    const insuranceItem = insurances?.find(ins => ins.uuid === insurance.insurance.uuid);
                                    return (<Stack direction={"row"}>
                                        {insuranceItem?.logoUrl &&
                                            <ImageHandler
                                                alt={insuranceItem?.name}
                                                src={insuranceItem?.logoUrl.url}
                                            />}
                                        <Typography
                                            ml={1}>{insuranceItem?.name}</Typography>
                                    </Stack>)
                                })()}
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <Stack direction={"row"}
                                       justifyContent={"space-between"}
                                       alignItems={"center"}>
                                    <Typography
                                        variant={"body2"}
                                    >
                                        {insurance.insuranceNumber}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Stack direction={"row"}
                                       justifyContent={"space-between"}
                                       alignItems={"center"}>
                                    <Typography
                                        variant={"body2"}
                                    >
                                        {t(`social_insured.${SocialInsured.find(insur => insur.value === insurance.type.toString())?.label}`, {ns: "common"})}
                                    </Typography>
                                </Stack>
                            </Grid>
                            {!editable.personalInsuranceCard &&
                                <Grid pt={.5} pb={.5} item xs={6} md={4}>
                                    <Stack direction={"row"} alignItems={"start"} spacing={1}
                                           justifyContent={"flex-end"}>
                                        <IconButton
                                            disabled={loadingRequest}
                                            className='btn-add'
                                            onClick={() => handleEditInsurance(insurance)}
                                            size="small">
                                            <IconUrl path={"setting/edit"}/>
                                        </IconButton>
                                        <IconButton
                                            disabled={loadingRequest}
                                            className='icon-button'
                                            color={"error"}
                                            sx={{
                                                paddingTop: .4,
                                                "& svg": {
                                                    width: 18,
                                                    height: 18
                                                },
                                            }}
                                            onClick={() => handleDeleteInsurance(insurance)}
                                            size="small">
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Stack>
                                </Grid>}
                        </Grid>
                        {(patientInsurances.length - 1) !== index &&
                            <Divider sx={{marginBottom: 1}}/>}
                    </>
                )}
            </Grid>
        </Stack>
    </Grid>))
}*/
