import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useEffect} from "react";
import {setSelectedBoxes} from "@features/leftActionBar";
import {useAppDispatch} from "@lib/redux/hooks";

function useCashBox() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpBoxesResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`
    }, ReactQueryNoValidateConfig);

    useEffect(() => {
        if (httpBoxesResponse) {
            const cashboxes = (httpBoxesResponse as HttpResponse).data;
            if (cashboxes.length > 0) {
                dispatch(setSelectedBoxes([cashboxes[0]]));
            }
        }
    }, [dispatch, httpBoxesResponse]);

    return {cashboxes: ((httpBoxesResponse as HttpResponse)?.data ?? []) as any[]}
}

export default useCashBox;
