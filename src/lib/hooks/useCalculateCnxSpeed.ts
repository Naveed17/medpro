import {useCallback, useEffect} from "react";
import {useAppDispatch} from "@lib/redux/hooks";
import {setConnexionStatus} from "@features/base";

function useCalculateCnxSpeed() {
    const dispatch = useAppDispatch();

    const checkConnectionSpeed = useCallback(() => {
        const imageAddr = `/static/img/absence.png`;
        let startTime: number, endTime;
        const downloadSize = 4096;
        const download = new Image();
        startTime = (new Date()).getTime();
        download.src = imageAddr;
        download.onload = function () {
            endTime = (new Date()).getTime();
            const duration = (endTime - startTime) / 1000;
            const bitsLoaded = downloadSize * 8;
            const speedBps = parseFloat((bitsLoaded / duration).toFixed(2));
            const speedKbps = parseFloat((speedBps / 1024).toFixed(2));

            dispatch(setConnexionStatus(speedKbps < 8))
        };
    }, [dispatch]);

    useEffect(() => {
        checkConnectionSpeed();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

export default useCalculateCnxSpeed
