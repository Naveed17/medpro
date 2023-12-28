import DefaultCircleIcon from "@themes/overrides/icons/defaultCircleIcon";
import ConfirmCircleIcon from "@themes/overrides/icons/confirmCircleIcon";
import FinishedCircleIcon from "@themes/overrides/icons/finishedCircleIcon";
import CancelCircleIcon from "@themes/overrides/icons/cancelCircleIcon";

export const docTypes: { [key: number]: { label: string, classColor: string, icon: any } } = {
    0: {
        label: "pending",
        classColor: "warning",
        icon: <DefaultCircleIcon/>,
    },
    1: {
        label: "finish",
        classColor: "success",
        icon: <ConfirmCircleIcon/>,
    },
    2: {
        label: "affected",
        classColor: "primary",
        icon: <FinishedCircleIcon/>,
    },
    3: {
        label: "failed",
        classColor: "error",
        icon: <CancelCircleIcon/>,
    }
}
