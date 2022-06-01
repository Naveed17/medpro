import React from "react";

export {};

declare global {

    type LayoutProps =  {
        children: React.ReactNode;
        pageProps?: any
        cookies?: unknown
    };
}
