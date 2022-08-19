import React from "react";
import {ReactSVG} from "react-svg";

interface iconUrl {
    path?: string
    onChange?: any
    className?: string
    color?: string
    variant?: string
}

export default function IconUrl({path, onChange, className, ...props}: iconUrl) {
    const {color} = props;
    const prefix = "/static/icons/";
    return <ReactSVG  {...props}
                      onClick={onChange}
                      {...(color) ? {
                          beforeInjection: ((svg) => {
                              // Modify the first `g` element within the SVG.
                              const firstGElement = svg.querySelectorAll('path');
                              firstGElement.forEach(path => path.setAttribute('fill', color as string))
                          })
                      } : {}}
                      className={`react-svg ${className ? className : ''}`}
                      src={`${prefix}${path}.svg`}/>;
}
