import {useRef, useEffect} from "react";

// ----------------------------------------------------------------------

function useIsMountedRef() {
    const isMounted = useRef(true);

    useEffect(() => () => {
        isMounted.current = false;
    }, []);

    return isMounted;
}

export default useIsMountedRef;
