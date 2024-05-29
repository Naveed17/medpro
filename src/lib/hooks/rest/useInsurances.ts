import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

function useInsurances(enable: boolean = true) {
    const router = useRouter();
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpInsuranceResponse, isLoading} = useRequestQuery(enable ? {
        method: "GET",
        url: `/api/public/insurances/${router.locale}?MedicalEntity=${medical_entity.uuid}`,
    } : null, ReactQueryNoValidateConfig);

    return {
        insurances: (Array.isArray(httpInsuranceResponse) ? httpInsuranceResponse : ((httpInsuranceResponse as HttpResponse)?.data ?? [])) as InsuranceModel[],
        isLoading
    }
}

export default useInsurances;
