import {useCallback} from "react";

const useSendNotification = ({...props}) => {

    const trigger = useCallback(() => {

    }, []);

    return {
        trigger
    }
}

export default useSendNotification;
