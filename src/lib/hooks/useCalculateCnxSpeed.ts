import {useEffect, useRef} from "react";
import {useSnackbar} from "notistack";
import {useTranslation} from "next-i18next";

function useCalculateCnxSpeed() {
    const {enqueueSnackbar} = useSnackbar();

    const {t} = useTranslation("common");

    const startTime = useRef<any>(null);
    const endTime = useRef<any>(null);
    const imageSize = useRef<any>(null);
    const image = useRef<any>(new Image());
    const speedInMbps = useRef<any>(null);
    let imageLink = "https://source.unsplash.com/random?topics=nature";

    const calculateSpeed = () => {
        let timeDuration = (endTime.current - startTime.current) / 1000;
        let loadedBits = imageSize.current * 8;
        let speedInBps = parseFloat((loadedBits / timeDuration).toFixed(2));
        let speedInKbps = parseFloat((speedInBps / 1024).toFixed(2));
        speedInMbps.current = parseFloat((speedInKbps / 1024).toFixed(2));
        console.log("speedInMbps", speedInMbps.current);
        if (speedInMbps.current < 0.6) {
            enqueueSnackbar(t("slow-connection"), {
                key: "slow",
                variant: 'warning',
                anchorOrigin: {horizontal: "left", vertical: "bottom"},
                persist: true
            })
        }
    }

    image.current.onload = async function () {
        endTime.current = new Date().getTime();
        await fetch(imageLink).then((response) => {
            imageSize.current = response.headers.get("content-length");
            calculateSpeed();
        });
    };

    useEffect(() => {
        startTime.current = new Date().getTime();
        image.current.src = imageLink;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

export default useCalculateCnxSpeed
