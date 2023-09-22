import {useCallback} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";

const useSendNotification = () => {
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const {trigger: triggerNotificationPush} = useRequestQueryMutation("notification/push");

    const trigger = useCallback((data: any) => {
        const form = new FormData();
        form.append("action", data.action);
        data.message && form.append("message", data.message);
        data.root && form.append("root", data.root);
        form.append("content", data.content);
        return triggerNotificationPush({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/professionals/notification/${router.locale}`,
            data: form
        });
    }, [router.locale, triggerNotificationPush, urlMedicalEntitySuffix]);

    return {
        trigger
    }
}

export default useSendNotification;
