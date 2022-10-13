import {useRouter} from "next/router";
import {useEffect} from "react";

function Redirect({to}: { to: string }) {
    const router = useRouter();

    useEffect(() => {
        router.push(to);
    }, [router, to]);
    return null;
}

export default Redirect;
