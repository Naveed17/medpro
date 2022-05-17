import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setConfig} from "../setConfig/selectors";
import {useEffect} from "react";
import {setDirection} from "../setConfig/actions";
import {useRouter} from "next/router";
import Dashboard from "../dashbord/dashboard";

type LayoutProps = {
    children: React.ReactNode,
};

export default function Layout({ children }: LayoutProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const config = useAppSelector(setConfig);

    useEffect(() => {
        const handleRouteChange = (url: string, { shallow }: any) => {
            console.log(url, shallow);
            let lang = 'fr';
            if(url.includes('/ar/') || url === '/ar'){
                lang = 'ar';
            }
            dispatch(setDirection(lang === 'ar' ? 'rtl': 'ltr'));
        }

        router.events.on('routeChangeStart', handleRouteChange);

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        }
    }, [])

    return (
        <>
            <main dir={config.direction}>
                <Dashboard />
                {children}
            </main>
        </>
)
}
