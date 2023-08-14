import {CheckList} from "@features/checkList";
import {useRequest} from "@lib/axios";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

function ModeRegDialog(info: any) {
    const [items, setItems] = useState<InsuranceModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    const {data} = useRequest({
        method: "GET",
        url: `/api/public/payment-means/${router.locale}`
    });

    useEffect(() => {
        if (data !== undefined) {
            setItems((data as any).data);
            setLoading(false);
        }
    }, [data])

    return (
        <CheckList items={items}
                   data={info}
                   loading={loading}
                   action={'mode'}
                   search={''}/>
    )
}

export default ModeRegDialog
