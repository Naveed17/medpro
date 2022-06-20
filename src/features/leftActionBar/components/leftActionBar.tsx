import { useRouter } from "next/router";
import { LeftActionsData } from "@features/leftActionBar";

function LeftActionBar() {
    const router = useRouter();
    const selectted = LeftActionsData.find((item) =>
        router.pathname.startsWith(item.pathname),
    );

    const Component: any = selectted?.component;

    return selectted ? (
        <>
            <Component />
        </>
    ) : null
}

export default LeftActionBar;
