import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useSession} from "next-auth/react";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useEffect, useState} from "react";

function useDuplicatedDetect({...props}) {
    const {patientId} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [duplications, setDuplications] = useState<PatientModel[]>([]);

    const {data: httpPatientDuplicationResponse, isLoading} = useRequest(medicalEntityHasUser && patientId ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/duplications/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    useEffect(() => {
        setDuplications(httpPatientDuplicationResponse ? (httpPatientDuplicationResponse as HttpResponse).data as PatientModel[] : []);
    }, [httpPatientDuplicationResponse])

    return {duplications, isLoading}
}

export default useDuplicatedDetect;
