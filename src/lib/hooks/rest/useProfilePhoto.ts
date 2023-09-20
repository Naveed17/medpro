import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function useProfilePhoto({...props}) {
    const {patientId, hasPhoto} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {
        data: httpPatientPhotoResponse,
        mutate: mutatePatientPhoto
    } = useRequestQuery((medicalEntityHasUser && hasPhoto && patientId) ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patientId}/documents/profile-photo/${router.locale}`
    } : null, ReactQueryNoValidateConfig);


    return {patientPhoto: (httpPatientPhotoResponse as HttpResponse)?.data.photo ?? null, mutatePatientPhoto}
}

export default useProfilePhoto;
