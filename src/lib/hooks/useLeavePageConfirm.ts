import {useEffect} from "react";
import Router from "next/router";

export const useLeavePageConfirm = (refCallback: any) => {

    useEffect(() => {
        Router.events.on("routeChangeStart", refCallback);
        return () => {
            Router.events.off("routeChangeStart", refCallback);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

};


