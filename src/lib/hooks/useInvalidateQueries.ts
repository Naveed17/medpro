import {useCallback} from "react";
import {useQueryClient} from "@tanstack/react-query";

function useInvalidateQueries() {
    const queryClient = useQueryClient();

    const trigger = useCallback((urls: string[]) => {
        return Promise.all(urls.map(url => queryClient.invalidateQueries({queryKey: [url]})));
    }, [queryClient])

    return {
        trigger
    }
}

export default useInvalidateQueries;
