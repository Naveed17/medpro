import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {useMediaQuery, useTheme} from "@mui/material";

function useMPActs({...props}) {
    const {noPagination} = props

    const router = useRouter();

    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const { medical_professional } = useMedicalProfessionalSuffix();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const {data: httpActsResponse, mutate:mutateActs,error,isLoading} = useRequestQuery(medical_professional ?{
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(medical_professional && { variables: { query: !isMobile && !noPagination ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true` : "?sort=true" } })
    });

    return {
        acts: (Array.isArray(httpActsResponse) ? httpActsResponse : ((httpActsResponse as HttpResponse)?.data ?? [])) as any,
        mutateActs,
        error,
        isLoading
    }
}

export default useMPActs;
