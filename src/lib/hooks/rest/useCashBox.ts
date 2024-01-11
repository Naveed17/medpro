import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useEffect} from "react";
import {setSelectedBoxes} from "@features/leftActionBar";
import {useAppDispatch} from "@lib/redux/hooks";
import {useSession} from "next-auth/react";

function useCashBox() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {update} = useSession();

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpBoxesResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/cash-boxes/${router.locale}`
    }, ReactQueryNoValidateConfig);

    useEffect(() => {
        if (httpBoxesResponse) {
            const cashBoxes = (httpBoxesResponse as HttpResponse).data.map((data: any) => data.cashBox);
            const permissions = (httpBoxesResponse as HttpResponse).data.map((data: any) => data.permissions);
            if (cashBoxes.length > 0) {
                dispatch(setSelectedBoxes([cashBoxes[0]]));
            }
            if (permissions.length > 0) {
                update({
                    permissions: permissions[0],
                    slug: "cashbox"
                })
            }
        }
    }, [dispatch, httpBoxesResponse]); // eslint-disable-line react-hooks/exhaustive-deps

    return {cashboxes: ((httpBoxesResponse as HttpResponse)?.data?.map((data: any) => data.cashBox) ?? []) as any[]}
}

export default useCashBox;
