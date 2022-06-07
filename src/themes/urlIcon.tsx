import React from "react";
import { ReactSVG } from "react-svg";

interface iconUrl{
    path?: string
    onChange?:any
    className?: string
    variant?: string
}

export default function IconUrl({ path, onChange, className, ...props }: iconUrl) {
    const prefix = "/static/icons/";
    return <ReactSVG  {...props} onClick={onChange} className={`react-svg ${className ? className : ''}`} src={`${prefix}${path}.svg`} />;
}
