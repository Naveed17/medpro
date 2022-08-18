import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import {Box} from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {setStepperIndex} from "@features/calendar";
import {useAppDispatch} from "@app/redux/hooks";
import {AutoCompleteButton} from "@features/buttons";
import {useRequest} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {AddPatientStep1} from "@features/tabPanel";

function Patient({...props}) {
    const {onNext} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [addPatient, setAddPatient] = useState<boolean>(false);

    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpPatientResponse} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/patients/${router.locale}?withPagination=false`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    if (!ready) return (<LoadingScreen/>);

    const patients = (httpPatientResponse as HttpResponse)?.data as PatientModel[];

    const handleOnClick = () => {
        setAddPatient(true);
    }

    const onNextStep = () => {
        dispatch(setStepperIndex(3))
        onNext(3)
    }

    return (
        <div>
            {!addPatient ? <>
                    <Box className="inner-section">
                        <Typography variant="h6" color="text.primary">
                            {t("stepper-2.title")}
                        </Typography>
                        <Typography variant="body1" sx={{textTransform: 'uppercase'}} color="text.primary" mt={3} mb={1}>
                            {t("stepper-2.sub-title")}
                        </Typography>
                        <AutoCompleteButton
                            OnClickAction={handleOnClick}
                            translation={t}
                            {...{data: patients}} />

                    </Box>
                    <Paper
                        sx={{
                            borderRadius: 0,
                            borderWidth: "0px",
                            textAlign: "right",
                        }}
                        className="action"
                    >
                        <Button
                            size="medium"
                            variant="text-primary"
                            color="primary"
                            sx={{
                                mr: 1,
                            }}
                            onClick={() => dispatch(setStepperIndex(1))}
                        >
                            {t("back")}
                        </Button>
                        <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            onClick={onNextStep}
                        >
                            {t("next")}
                        </Button>
                    </Paper>
                </>
                :
                <AddPatientStep1
                    translationKey={"agenda"}
                    translationPrefix={"steppers.stepper-2.patient"}
                    onClose={() => setAddPatient(false)}
                    OnSubmit={(event: any) => console.log(event)}/>
            }
        </div>
    )
}

export default Patient;
