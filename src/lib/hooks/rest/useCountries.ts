import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

function useCountries() {
    const router = useRouter();
    const [countries, setCountries] = useState<CountryModel[]>([]);

    const {data: httpCountriesResponse} = useRequest({
        method: "GET",
        url: `/api/public/places/countries/${router.locale}?nationality=true`
    }, SWRNoValidateConfig);

    useEffect(() => {
        if (httpCountriesResponse) {
            setCountries((httpCountriesResponse as HttpResponse)?.data);
        }
    }, [httpCountriesResponse]);

    return {countries}
}

export default useCountries;
