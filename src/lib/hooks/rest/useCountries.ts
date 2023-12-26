import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function useCountries(params?: string, enable: boolean = true) {
    const router = useRouter();

    const {data: httpCountriesResponse} = useRequestQuery(enable ? {
        method: "GET",
        url: `/api/public/places/countries/${router.locale}${params ? `?${params}` : ""}`
    } : null, ReactQueryNoValidateConfig);

    return {countries: (Array.isArray(httpCountriesResponse) ? httpCountriesResponse : ((httpCountriesResponse as HttpResponse)?.data ?? [])) as CountryModel[]}
}

export default useCountries;
