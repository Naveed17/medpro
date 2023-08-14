import {useRequest} from "@lib/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";

function useDocumentsPatient({...props}) {
    const {patientId = null} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {
        data: httpPatientDocumentsResponse,
        isLoading,
        mutate: mutatePatientDocuments
    } = useRequest(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/documents/${router.locale}`
    } : null);

    return {
        patientDocuments: (httpPatientDocumentsResponse as HttpResponse)?.data ?? [],
        mutatePatientDocuments,
        isLoading
    }
}

export default useDocumentsPatient;
