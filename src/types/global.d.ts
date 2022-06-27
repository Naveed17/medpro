import React from "react";

declare global {

    type LayoutProps = {
        children: React.ReactNode;
        fallback?: any;
        pageProps?: any;
        session?: any;
    };
}

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        google: true;
        "text-black": true;
        filter: true;
        consultationIP: true;
    }
}

declare module "@mui/material/Chip" {
    interface ChipPropsVariantOverrides {
        "contained": true;
    }
}

declare module "@mui/material" {
    interface Color {
        '500_32': string;
        '500_16': string;
    }
}