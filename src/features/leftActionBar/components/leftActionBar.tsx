import {useRouter} from "next/router";
import {LeftActionsData} from "@features/leftActionBar";

function LeftActionBar({...props}) {
    const router = useRouter();

    const selected = LeftActionsData.find((item) => {
        if (router.pathname === item.pathname) {
            return true
        } else return router.pathname.includes(item.pathname)
    });

    const Component: any = selected?.component;

    return selected ? <Component {...props} /> : null;
}

export default LeftActionBar;
