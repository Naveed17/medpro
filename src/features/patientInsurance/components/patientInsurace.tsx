import React from 'react';
import InsuranceStyled from "@features/patientInsurance/components/overrides/insuranceStyled";
import {TextField, Typography} from "@mui/material";

const PatientInsurance = ({...props}) => {
    const {patientInsurances, t} = props;

    console.log(patientInsurances)
    return (
        <InsuranceStyled>
            <Typography
                className="label"
                variant="body2"
                color="text.secondary">
                {t("insurance.agreement")}
            </Typography>

            <TextField
                variant="outlined"
                placeholder={t("insurance.select")}
                size="small"
                fullWidth
            />

            <Typography
                className="label"
                variant="body2"
                color="text.secondary">
                {t("insurance.member")}
            </Typography>
            <TextField
                variant="outlined"
                placeholder={t("insurance.member_placeholder")}
                size="small"
                fullWidth
            />
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
