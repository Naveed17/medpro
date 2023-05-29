import Image from "next/image";
import {useState} from "react";

function ImageHandler({...props}) {
    const {alt, src = null} = props;
    const [error, setError] = useState(false);

    return (<Image
        {...{alt}}
        src={"/static/icons/Med-logo.png"}
        style={{borderRadius: 2}}
        placeholder="blur"
        onError={() => setError(true)}
        blurDataURL="/static/icons/Med-logo.png"
        width={20}
        height={20}
        loader={() => {
            return error ? "/static/icons/Med-logo.png" : src;
        }}
        {...props}
    />)
}

export default ImageHandler;
