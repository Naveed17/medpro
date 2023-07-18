import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useSession} from "next-auth/react";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useEffect, useState} from "react";

function useProfilePhoto({...props}) {
    const {patientId, hasPhoto} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [patientPhoto, setPatientPhoto] = useState<any>(null)

    const {
        data: httpPatientPhotoResponse,
        mutate: mutatePatientPhoto
    } = useRequest((medicalEntityHasUser && hasPhoto && patientId) ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/documents/profile-photo/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    useEffect(() => {
        setPatientPhoto(httpPatientPhotoResponse ? (httpPatientPhotoResponse as HttpResponse)?.data.photo : null);
    }, [httpPatientPhotoResponse])

    return {patientPhoto, mutatePatientPhoto}
}

export default useProfilePhoto;
