import React, {useState} from "react";
// material
import {
    Typography,
    TableRow,
    TableCell,
    useMediaQuery,
    Skeleton, DialogActions, Button,
} from "@mui/material";
// components
import {RDVCard, RDVMobileCard, RDVPreviousCard} from "@features/card";
// utils
import {useTranslation} from "next-i18next";
import _ from "lodash";
import {LoadingScreen} from "@features/loadingScreen";
import {useAppSelector} from "@lib/redux/hooks";
import {Dialog, preConsultationSelector} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {configSelector} from "@features/base";
import useSWRMutation from "swr/mutation";
import {sendRequest} from "@lib/hooks/rest";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useSession} from "next-auth/react";
import {agendaSelector} from "@features/calendar";
import {useRouter} from "next/router";

function RDVRow({...props}) {
    const {data: patient, loading} = props;
    const {data: session} = useSession();
    const matches = useMediaQuery("(min-width:900px)");
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();
    const router = useRouter();

    const {model} = useAppSelector(preConsultationSelector);
    const {direction} = useAppSelector(configSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const [appointmentData, setAppointmentData] = useState<any>(null);

    const {trigger: handlePreConsultationData} = useSWRMutation(["/pre-consultation/update", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);

    const [openPreConsultationDialog, setOpenPreConsultationDialog] = useState<boolean>(false);
    const [loadingReq, setLoadingReq] = useState<boolean>(false);

    const mapped =
        !loading &&
        patient.previousAppointments?.map((v: any) => {
            return {
                ...v,
                year: v.dayDate.slice(-4),
            };
        });

    const previousAppointments = _(mapped)
        .groupBy("year")
        .map((items, year) => ({
            year: year,
            data: _.map(items),
        }))
        .value()
        .reverse();

    const handlePreConsultationDialog = (inner: any) => {
        setAppointmentData(inner);
        setOpenPreConsultationDialog(true);
    }

    const submitPreConsultationData = () => {
        setLoadingReq(true);
        handlePreConsultationData({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appointmentData?.uuid}/data/${router.locale}`,
            data: {
                "modal_uuid": model,
                "modal_data": localStorage.getItem(`Modeldata${appointmentData?.uuid}`) as string
            }
        } as any).then(() => {
            setLoadingReq(false);
            localStorage.removeItem(`Modeldata${appointmentData?.uuid}`);
            setOpenPreConsultationDialog(false)
        });
    }

    const {t, ready} = useTranslation("patient", {
        keyPrefix: "patient-details",
    });

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <React.Fragment>
            {patient?.nextAppointments.length > 0 && <TableRow>
                <TableCell colSpan={3} className="text-row">
                    <Typography variant="body1" color="text.primary">
                        {loading ? (
                            <Skeleton variant="text" sx={{maxWidth: 200}}/>
                        ) : (
                            <>
                                {t("next-appo")}{" "}
                                {patient.nextAppointments.length > 1 &&
                                    `(${patient.nextAppointments.length})`}
                            </>
                        )}
                    </Typography>
                </TableCell>
            </TableRow>}
            {(loading ? Array.from(new Array(3)) : patient.nextAppointments).map(
                (data: PatientDetailsRDV) => (
                    <React.Fragment key={Math.random()}>
                        {matches ? (
                            <RDVCard
                                inner={data}
                                {...{t, patient, loading, handlePreConsultationDialog}} />
                        ) : (
                            <RDVMobileCard
                                inner={data}
                                {...{loading, handlePreConsultationDialog}} />
                        )}
                    </React.Fragment>
                )
            )}
            {patient.previousAppointments.length > 0 && <TableRow>
                <TableCell colSpan={3} className="text-row">
                    <Typography variant="body1" color="text.primary">
                        {loading ? (
                            <Skeleton variant="text" sx={{maxWidth: 200}}/>
                        ) : (
                            <>
                                {t("old-appo")}{" "}
                                {patient.previousAppointments.length > 1 &&
                                    `(${patient.previousAppointments.length})`}
                            </>
                        )}
                    </Typography>
                </TableCell>
            </TableRow>}
            {(loading ? Array.from(new Array(1)) : previousAppointments).map(
                (data: any) => (
                    <React.Fragment key={Math.random()}>
                        <TableRow>
                            <TableCell className="text-row">
                                <Typography variant="body1" color="text.primary">
                                    {loading ? (
                                        <Skeleton variant="text" sx={{maxWidth: 200}}/>
                                    ) : (
                                        <>{data.year}</>
                                    )}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        {(loading ? Array.from(new Array(4)) : data?.data).map(
                            (inner: any) => (
                                <React.Fragment key={Math.random()}>
                                    {matches ? (
                                        <RDVPreviousCard
                                            inner={inner}
                                            {...{patient, loading, handlePreConsultationDialog}}
                                            key={Math.random()}
                                        />
                                    ) : (
                                        <RDVMobileCard
                                            inner={inner}
                                            {...{loading, handlePreConsultationDialog}}
                                            key={Math.random()}/>
                                    )}
                                </React.Fragment>
                            )
                        )}
                    </React.Fragment>
                )
            )}

            <Dialog
                action={"pre_consultation_data"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380
                    }
                }}
                open={openPreConsultationDialog}
                data={{
                    patient,
                    uuid: appointmentData?.uuid
                }}
                size={"md"}
                title={t("pre_consultation_dialog_title")}
                {...(!loadingReq && {dialogClose: () => setOpenPreConsultationDialog(false)})}
                actionDialog={
                    <DialogActions>
                        <Button onClick={() => setOpenPreConsultationDialog(false)} startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <Button
                            disabled={loadingReq}
                            variant="contained"
                            onClick={() => submitPreConsultationData()}
                            startIcon={<IconUrl path="ic-edit"/>}>
                            {t("register")}
                        </Button>
                    </DialogActions>
                }
            />
        </React.Fragment>
    );
}

export default RDVRow;
