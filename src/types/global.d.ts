import React from "react";

export {};

declare global {

    type LayoutProps =  {
        children: React.ReactNode;
        pageProps?: any
        session?: any
    };
}

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        google: true;
    }
}
