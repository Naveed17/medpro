import {useEffect, useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import {useAppointmentHistory} from "@lib/hooks/rest";

// ----------------------------------------------------------------------
function useLastPrescription() {
    const {appointement} = useAppSelector(consultationSelector);

    const {previousAppointmentsData} = useAppointmentHistory({patientId: appointement?.patient?.uuid});

    const [lastPrescriptions, setLastPrescriptions] = useState<any[]>([]);

    useEffect(() => {
        let lastPrescription: any[] = []
        if (previousAppointmentsData?.list?.length > 0) {
            previousAppointmentsData.list.map((la: { documents: any[]; }) => {
                const prescriptions = la.documents.filter(doc => doc.documentType === "prescription");
                if (prescriptions.length > 0) {
                    lastPrescription = [...lastPrescription, ...prescriptions]
                }
            })
            setLastPrescriptions(lastPrescription)
        }
    }, [previousAppointmentsData])

    return {lastPrescriptions};
}

export default useLastPrescription;
