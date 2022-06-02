import React from "react";
import { ReactSVG } from "react-svg";

interface iconUrl{
    path?: string
    className?: string
    variant?: string
}

export default function IconUrl({ path, className, ...props }: iconUrl) {
    const prefix = "/static/icons/";
    return <ReactSVG {...props} className={`react-svg ${className ? className : ''}`} src={`${prefix}${path}.svg`} />;
}
