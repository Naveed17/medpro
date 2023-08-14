import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";

function useCountries(params?: string) {
    const router = useRouter();

    const {data: httpCountriesResponse} = useRequest({
        method: "GET",
        url: `/api/public/places/countries/${router.locale}${params ? `?${params}` : ""}`
    }, SWRNoValidateConfig);

    return {countries: (Array.isArray(httpCountriesResponse) ? httpCountriesResponse : ((httpCountriesResponse as HttpResponse)?.data ?? [])) as ContactModel[]}
}

export default useCountries;
