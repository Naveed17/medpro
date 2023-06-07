import {useEffect, useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {consultationSelector} from "@features/toolbar";
// ----------------------------------------------------------------------
function useLastPrescription() {
    const {appointement} = useAppSelector(consultationSelector);

    const [lastPrescriptions, setLastPrescriptions] = useState<any[]>([]);

    useEffect(() => {
        let lastPrescription: any[] = []
        if (appointement !== null) {
            appointement.latestAppointments.map((la: { documents: any[]; }) => {
                const prescriptions = la.documents.filter(doc => doc.documentType === "prescription");
                if (prescriptions.length > 0) {
                    lastPrescription = [...lastPrescription, ...prescriptions]
                }
            })
            setLastPrescriptions(lastPrescription)
        }
    }, [appointement])

    return {lastPrescriptions};
}

export default useLastPrescription;
