import {useRouter} from "next/router";
import {LeftActionsData} from "@features/leftActionBar";

function LeftActionBar() {
    const router = useRouter();
    const selected = LeftActionsData.find((item) =>
        router.pathname.startsWith(item.pathname),
    );

    const Component: any = selected?.component;

    return selected ? (
        <Component/>
    ) : null
}

export default LeftActionBar;
