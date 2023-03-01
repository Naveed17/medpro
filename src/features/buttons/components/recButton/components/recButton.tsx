import React, {useState} from "react";
import {Player} from "@lottiefiles/react-lottie-player";
import MicIcon from "@mui/icons-material/Mic";
import PauseIcon from "@mui/icons-material/Pause";
import {motion} from "framer-motion";
import {Fab} from "@mui/material";

function RecButton({...props}) {
    const {onClick} = props;
    const [expand, setExpand] = useState(false);
    return (
        <Fab
            component={motion.div}
            sx={{
                height: "auto",
                width: "auto",
                boxShadow: "none",
                p: 1,
                svg: {
                    path: {
                        fill: "white",
                    },
                },
            }}
            layout
            transition={{
                delay: 0.5,
                x: {duration: 0.2},
                default: {ease: "linear"},
            }}
            onClick={() => {
                setExpand(!expand)
                onClick && onClick();
            }}
            color="error"
            variant={expand ? "extended" : "circular"}>
            {expand ? <PauseIcon/> : <MicIcon/>}
            {expand && (
                <Player
                    autoplay
                    loop={true}
                    src="/static/lotties/voice-wave.json"
                    style={{
                        height: "16px",
                        width: "85px",
                        transform: "scale(1.2)",
                    }}
                />
            )}
        </Fab>
    );
}

export default RecButton;
