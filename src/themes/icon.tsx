import React from "react";
import { ReactSVG } from "react-svg";
interface IconProps {
  path : string;
  className?: string
}

export default function Icon({ path, className, ...props }: IconProps) {
  const prefix = "/static/icons/";
  return <ReactSVG {...props} className={`react-svg ${className? className : ''}`} src={`${prefix}${path}.svg`} />;
}
