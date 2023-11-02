import {CustomShadowType} from "@themes/shadows";
import React from "react";
import {PaletteColor} from "@mui/material";
import {DateClickArg} from "@fullcalendar/interaction";

declare global {
    type LayoutProps = {
        children: React.ReactNode;
        fallback?: any;
        pageProps?: any;
        session?: any;
        dehydratedState?: any;
        sx?: any;
    };

    interface Array<T> {
        group(fn: Function): Array<T>;
    }
}

declare module "next-auth" {
    interface Session {
        data: any;
        accessToken: string;
        error: string;
    }
}

declare module "notistack" {
    interface VariantOverrides {
        // adds `offline` variant
        offline: true;
    }
}
declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        google: true;
        white: true;
        "text-transparent": true;
        "text-black": true;
        "contained-white": true
        filter: true;
        "text-primary": true;
        consultationIP: true;
    }

    interface ButtonPropsColorOverrides {
        text: true,
        white: true;
        black: true;
    }
}

declare module "@mui/material/CircularProgress" {
    interface CircularProgressPropsColorOverrides {
        white: true
    }
}
declare module "@mui/material/Chip" {
    interface ChipPropsVariantOverrides {
        contained: true;
    }
}

declare module "@mui/material/SvgIcon" {
    interface SvgIconPropsColorOverrides {
        text: true,
        white: true;
        black: true;
    }
}

declare module "@mui/material" {

    interface Color {
        0: number | string;
        "500_32": string;
        "500_16": string;
        A0: string;
        A10: string;
        A11: string;
        A50: string;
        A60: string;
        A200: string;
        A300: string;
        A400: string;
        A500: string;
        A600: string;
        A700: string;
        A800: string;
        A900: string;
        B900: string;
        B901: string;
    }

    interface PaletteColor {
        lighter: string;
        light: string;
        main: string;
        darker?: string;
    }

    interface Palette {
        back: PaletteColor
        expire: PaletteColor
    }

    interface ThemeOptions {
        customShadows?: CustomShadowType;
    }

    interface IconButtonPropsColorOverrides {
        white: true;
    }
}

declare module "@mui/material/styles" {
    interface Theme {
        customShadows: CustomShadowType;
    }
}

declare module "@fullcalendar/interaction" {
    interface MouseTouchEvent extends MouseEvent {
        changedTouches: Touch[]
    }

    interface DateClickTouchArg extends DateClickArg {
        jsEvent: MouseTouchEvent
    }
}

declare module '@emotion/styled/types' {
    interface CreateStyled<T> {
        isDragging?: Boolean
    }
}

declare module '@pqina/flip' {

}
