import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";

function useDocumentsPatient({...props}) {
    const {patientId = null} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {
        data: httpPatientDocumentsResponse,
        isLoading,
        mutate: mutatePatientDocuments
    } = useRequestQuery(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patientId}/documents/${router.locale}`
    } : null);

    return {
        patientDocuments: ((httpPatientDocumentsResponse as HttpResponse)?.data ?? []) as any[],
        mutatePatientDocuments,
        isLoading
    }
}

export default useDocumentsPatient;
