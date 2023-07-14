import {useRequest} from "@lib/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useSWRConfig} from "swr";

function useDocumentsPatient({...props}) {
    const {patientId = null} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {cache} = useSWRConfig();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [patientDocuments, setPatientDocuments] = useState<any[]>((medicalEntityHasUser && cache.get(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/documents/${router.locale}`)?.data?.data?.data) ?? []);

    const {
        data: httpPatientDocumentsResponse,
        isLoading,
        mutate: mutatePatientDocuments
    } = useRequest(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/documents/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    } : null);


    useEffect(() => {
        if (httpPatientDocumentsResponse) {
            setPatientDocuments((httpPatientDocumentsResponse as HttpResponse)?.data);
        }
    }, [httpPatientDocumentsResponse])

    return {patientDocuments, mutatePatientDocuments, isLoading}
}

export default useDocumentsPatient;
