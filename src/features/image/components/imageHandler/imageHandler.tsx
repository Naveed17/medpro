import Image from "next/image";
import {useState} from "react";

function ImageHandler({...props}) {
    const {alt, src = null} = props;
    const [srcUrl, setSrcUrl] = useState(src ?? "/static/icons/Med-logo.png");

    return (<Image
        {...{alt}}
        style={{borderRadius: 2}}
        onError={() => setSrcUrl("/static/icons/ic-failed-u.svg")}
        blurDataURL="/static/icons/Med-logo.png"
        width={20}
        height={20}
        {...props}
        src={srcUrl}
    />)
}

export default ImageHandler;
