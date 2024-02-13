import React, {useState} from 'react';
import InsuranceStyled from "@features/patientInsurance/components/overrides/insuranceStyled";
import {Box, Chip, Collapse, IconButton, Stack, TextField, Typography} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import IconUrl from "@themes/urlIcon";
import {NoDataCard} from "@features/card";
import AddIcCallTwoToneIcon from "@mui/icons-material/AddIcCallTwoTone";
import AddIcon from "@mui/icons-material/Add";
import AddInsurance from "@features/patientInsurance/components/addInsurance";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CardInsurance from "@features/patientInsurance/components/cardInsurance";

const PatientInsurance = ({...props}) => {
    const {patientInsurances, t} = props;

    const noAppData = {
        mainIcon: "ic-assurance",
        title: "insurance.noInsurance",
        description: "insurance.addInsurance"
    };

    const [addNew, setAddNew] = useState(false);
    const [selectedInsurance, setSelectedInsurance] = useState("");

    return (
        <InsuranceStyled spacing={1}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} pt={2} pb={1}>
                <Typography className={"title"}>{t('insurance.agreement')}</Typography>
                <IconButton
                    onClick={()=>setAddNew(!addNew)}
                    color={"success"}
                    className="success-light"
                    sx={{
                        mr: 1.5,
                        "& svg": {
                            width: 20,
                            height: 20,
                        },
                    }}>
                    {addNew ? <CloseRoundedIcon/>: <AddIcon/> }
                </IconButton>
            </Stack>

            <Collapse in={addNew}>
                <Box className={"insurance-box"}>
                    <AddInsurance {...{t,setAddNew}}/>
                </Box>
            </Collapse>

            {patientInsurances?.map(pi =>(
                <Box key={pi.uuid} className={"insurance-box"}>
                    <Collapse in={selectedInsurance !== pi.insurance.uuid}>
                        <CardInsurance {...{pi,setSelectedInsurance}}/>
                    </Collapse>
                    <Collapse in={selectedInsurance === pi.insurance.uuid}>
                        <AddInsurance {...{t,pi,setAddNew}}/>
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
