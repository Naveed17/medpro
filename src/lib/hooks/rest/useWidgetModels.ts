import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function useWidgetModel({...props}) {
    const router = useRouter();

    const {filter = ''} = props
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();

    const {data: httpModelsResponse, mutate: modelsMutate} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/modals/${router.locale}${filter}`
    } : null, ReactQueryNoValidateConfig);

    return {
        models: ((httpModelsResponse as HttpResponse)?.data ?? []) as (ModalModel[] | ModalModelPagination),
        modelsMutate
    }
}

export default useWidgetModel;
