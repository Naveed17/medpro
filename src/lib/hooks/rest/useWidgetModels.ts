import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {useSession} from "next-auth/react";
import {useSWRConfig} from "swr";

function useWidgetModel({...props}) {
    const router = useRouter();
    const {data: session} = useSession();
    const {cache} = useSWRConfig()

    const {filter = ''} = props
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();

    const [models, setModels] = useState<ModalModel[] | ModalModelPagination>([]);

    const {data: httpModelsResponse, mutate: modelsMutate} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/modals/${router.locale}${filter}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    useEffect(() => {
        if (httpModelsResponse) {
            setModels((httpModelsResponse as HttpResponse)?.data);
        }
    }, [httpModelsResponse]);

    useEffect(()=>{
        const cachedData = cache.get(`${urlMedicalProfessionalSuffix}/modals/${router.locale}${filter}`);
        if (cachedData)
            setModels(cachedData.data);
    },[cache, filter, router.locale, urlMedicalProfessionalSuffix])

    return {models, modelsMutate}
}

export default useWidgetModel;
