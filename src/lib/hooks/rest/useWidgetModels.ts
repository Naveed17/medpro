import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {useSession} from "next-auth/react";

function useWidgetModel({...props}) {
    const router = useRouter();
    const {data: session} = useSession();

    const {filter = ''} = props
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();

    const {data: httpModelsResponse, mutate: modelsMutate} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/modals/${router.locale}${filter}`
    } : null, SWRNoValidateConfig);

    return {models: (httpModelsResponse as HttpResponse)?.data ?? [], modelsMutate}
}

export default useWidgetModel;
