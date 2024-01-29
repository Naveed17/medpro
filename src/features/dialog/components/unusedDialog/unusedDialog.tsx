import Image from "next/image";
import {Typography} from "@mui/material";

function UnusedDialog({...props}) {
    const {data} = props;

    return (
        <>
            <Typography color={"primary"} sx={{textAlign: "center"}} variant="subtitle1">
                {data.title}
            </Typography>
            <Typography sx={{textAlign: "center"}} margin={1}>
                {data.subtitle}
            </Typography>

            <div style={{width: "fit-content", margin: "auto"}}>
                <Image
                    src={"/static/icons/ic-quote.svg"}
                    alt={"document"}
                    width={20}
                    height={20}
                />
            </div>
            <Typography sx={{textAlign: "center"}} fontSize={12} color={"grey"} margin={1}>
                {data.doc}
            </Typography>
        </>
    );
}

export default UnusedDialog;
