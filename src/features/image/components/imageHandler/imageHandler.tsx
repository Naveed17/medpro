import Image from "next/image";
import {useState} from "react";

function ImageHandler({...props}) {
    const {alt, src = null} = props;
    const [srcUrl, setSrcUrl] = useState(src ?? "/static/icons/Med-logo.png");

    return (<Image
        style={{borderRadius: 2}}
        onError={() => setSrcUrl("/static/icons/ic-failed-u.svg")}
        blurDataURL="/static/icons/Med-logo.png"
        width={20}
        height={20}
        alt={alt ?? "ImageHandler"}
        {...props}
        src={srcUrl}
    />)
}

export default ImageHandler;
