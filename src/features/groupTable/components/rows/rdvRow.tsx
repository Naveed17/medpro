import React, {useState} from "react";
// material
import {
    Typography,
    TableRow,
    TableCell,
    useMediaQuery,
    Skeleton, DialogActions, Button
} from "@mui/material";
// components
import {NoDataCard, RDVCard, RDVMobileCard, RDVPreviousCard} from "@features/card";
// utils
import {useTranslation} from "next-i18next";
import _ from "lodash";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {useAppSelector} from "@lib/redux/hooks";
import {Dialog, preConsultationSelector} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {configSelector, dashLayoutSelector} from "@features/base";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {agendaSelector} from "@features/calendar";
import {useRouter} from "next/router";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";

function RDVRow({...props}) {
    const {data: {patient, translate}} = props;
    const router = useRouter();
    const matches = useMediaQuery("(min-width:900px)");
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t, ready} = useTranslation("patient", {keyPrefix: "patient-details"});
    const {model} = useAppSelector(preConsultationSelector);
    const {direction} = useAppSelector(configSelector);
    const {config: agenda} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [appointmentData, setAppointmentData] = useState<any>(null);

    const {trigger: handlePreConsultationData} = useRequestQueryMutation("/pre-consultation/update");

    const {
        data: httpPatientHistoryResponse,
        isLoading
    } = useRequestQuery(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/appointments/list/${router.locale}`
    } : null, {refetchOnWindowFocus: false});

    const [openPreConsultationDialog, setOpenPreConsultationDialog] = useState<boolean>(false);
    const [loadingReq, setLoadingReq] = useState<boolean>(false);

    const patientHistory = (httpPatientHistoryResponse as HttpResponse)?.data;
    const nextAppointmentsData = patientHistory && patientHistory.nextAppointments.length > 0 ? patientHistory.nextAppointments : [];
    const previousAppointmentsData = patientHistory && patientHistory.previousAppointments.length > 0 ? patientHistory.previousAppointments : [];

    const mapped = !isLoading && previousAppointmentsData?.map((v: any) => {
        return {
            ...v,
            year: v.dayDate.slice(-4),
        };
    });

    const previousAppointments = _(mapped).groupBy("year").map((items, year) => ({
        year: year,
        data: _.map(items),
    })).value().reverse();

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
        }, {
            onSuccess: () => {
                setLoadingReq(false);
                localStorage.removeItem(`Modeldata${appointmentData?.uuid}`);
                setOpenPreConsultationDialog(false);
                medicalEntityHasUser && invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agenda?.uuid}/appointments/${appointmentData?.uuid}/consultation-sheet/${router.locale}`]);
            }
        });
    }

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (nextAppointmentsData?.length > 0 || previousAppointmentsData?.length > 0 ? (
            <React.Fragment>
                {nextAppointmentsData.length > 0 && <>
                    <TableRow>
                        <TableCell colSpan={3} className="text-row">
                            <Typography variant="body1" color="text.primary">
                                {t("next-appo")}{" "}
                                {nextAppointmentsData.length > 1 &&
                                    `(${nextAppointmentsData.length})`}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    {nextAppointmentsData.map((data: PatientDetailsRDV, index: number) => (
                            <React.Fragment key={"nextAppointmentsData" + index.toString()}>
                                {matches ? (
                                    <RDVCard
                                        inner={data}
                                        {...{t, patient, loading: false, handlePreConsultationDialog}} />
                                ) : (
                                    <RDVMobileCard
                                        inner={data}
                                        {...{loading: false, handlePreConsultationDialog}} />
                                )}
                            </React.Fragment>
                        )
                    )}
                </>}

                {previousAppointmentsData.length > 0 && <>
                    <TableRow>
                        <TableCell colSpan={3} className="text-row">
                            <Typography variant="body1" color="text.primary">
                                {t("old-appo")}{" "}
                                {previousAppointmentsData.length > 1 &&
                                    `(${previousAppointmentsData.length})`}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    {previousAppointments.map((data: any, index: number) => (
                        <React.Fragment key={"previousAppointments" + index.toString()}>
                            <TableRow>
                                <TableCell className="text-row">
                                    <Typography variant="body1" color="text.primary">
                                        {data.year}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            {data?.data.map(
                                (inner: any, index: number) => (
                                    <React.Fragment key={"previousAppointments" + index.toString()}>
                                        {matches ? (
                                            <RDVPreviousCard
                                                inner={inner}
                                                {...{patient, loading: false, handlePreConsultationDialog}}/>
                                        ) : (
                                            <RDVMobileCard
                                                inner={inner}
                                                {...{loading: false, handlePreConsultationDialog}}/>
                                        )}
                                    </React.Fragment>
                                )
                            )}
                        </React.Fragment>)
                    )}
                </>}

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
            </React.Fragment>) : !isLoading ? (
            <TableRow>
                <TableCell className="text-row">
                    <NoDataCard
                        t={translate}
                        ns={"patient"}
                        data={{
                            mainIcon: "ic-agenda-+",
                            title: "no-data.appointment.title",
                            description: "no-data.appointment.description"
                        }}
                    />
                </TableCell>
            </TableRow>) : <>
            <TableRow>
                <TableCell colSpan={3} className="text-row">
                    <Typography variant="body1" color="text.primary">
                        <Skeleton variant="text" sx={{maxWidth: 200}}/>
                    </Typography>
                </TableCell>
            </TableRow>
            {Array.from(new Array(3)).map(
                (data: PatientDetailsRDV, index: number) => (matches ? (
                    <RDVCard
                        key={"RDVCard" + index.toString()}
                        inner={data}
                        {...{t, patient, loading: true, handlePreConsultationDialog}} />
                ) : (
                    <RDVMobileCard
                        key={"RDVMobileCard" + index.toString()}
                        inner={data}
                        {...{loading: true, handlePreConsultationDialog}} />
                )))
            }
        </>
    );
}

export default RDVRow;
