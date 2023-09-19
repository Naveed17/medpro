import {useCallback} from "react";
import {useRequestMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";

const useUsersList = () => {
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: triggerNotificationPush} = useRequestMutation(null, "notification/push");

    const trigger = useCallback(() => {
        return triggerNotificationPush({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/users`
        });
    }, [triggerNotificationPush, urlMedicalEntitySuffix]);

    return {
        trigger
    }
}

export default useUsersList;
