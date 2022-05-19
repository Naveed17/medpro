import {useAppDispatch} from "@app/redux/hooks";
import {setDirection} from "../setConfig/actions";
import {useRouter} from "next/router";
import Head from "next/head";


type LayoutProps = {
    children: React.ReactNode,
};

export default function Layout({ children }: LayoutProps) {
    const router = useRouter();
    const dir = router.locale === 'ar' ? 'rtl': 'ltr';


    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main dir={dir}>
                {children}
            </main>
        </>
    )
}
