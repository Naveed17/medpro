import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import React from "react";
import {LoadingScreen} from "@features/loadingScreen";

function AuthGuard({ children }: LayoutProps) {
    const { status } = useSession();
    const router = useRouter();
    React.useEffect(() => {
        if (status === "unauthenticated" && router.asPath !== "/auth/signIn") {
            signIn('keycloak', { callbackUrl: (router.locale === 'ar' ? '/ar/dashboard' : '/dashboard')});
        }
    }, [status, router]);
    // Make sure that you show a loading state for BOTH loading and unauthenticated.
    // This is because when status becomes `unathenticated` the component renders,
    // returns children and then the useEffect redirect is fired afterwards,
    // hence the temporary flash of the child content.
    if (status === "loading" || status === "unauthenticated") {
        return <LoadingScreen />
    }
    return <>{children}</>;
}

export default AuthGuard;
