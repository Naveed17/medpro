import {styled} from "@mui/material/styles";

const RootStyled = styled("div")(({theme}) => ({
        "& .container": {
            position: "relative",
            width: 332,
            height: 137,
            border: "2px solid white",
            "& .img": {
                position: "absolute",
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundSize: "332px 100%"
            },
            "& .background-img": {
                backgroundImage: "url('/static/img/19.avif')"
            },
            "& .foreground-img": {
                backgroundImage: "url('/static/img/23.avif')",
                width: '50%'
            },

            "& .slider": {
                position: "absolute",
                top: 0,
                left: 0,
                "-webkit-appearance": "none",
                appearance: "none",
                width: "100%",
                height: "100%",
                background: "rgba(242, 242, 242, 0)",
                outline: "none",
                margin: 0,
                transition: "all .2s",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                "&:hover": {
                    background: "rgba(#f2f2f2, .1)"
                },
                "&::-webkit-slider-thumb": {
                    "-webkit-appearance": "none",
                    appearance: "none",
                    width: 0,
                    height: 600,
                    background: 'white',
                    cursor: 'pointer'
                },
                "&::-moz-range-thumb": {
                    width: 6,
                    height: 600,
                    background: "white",
                    cursor: "pointer"
                }
            },
            "& .slider-container": {
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
                position: "absolute",
                left: 'calc(50% - 18px)',
                top: '0',
                width: 30
            },
            "& .flesh-1": {
                borderWidth: 4.5,
                borderStyle: 'inset solid inset inset',
                borderColor: 'rgba(0, 0, 0, 0) rgb(255, 255, 255) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)',
                borderImage: 'initial',
                height: 0,
                marginRight: 7.5,
                width: 0
            },
            "& .flesh-2": {
                borderWidth: 4.5,
                borderStyle: 'inset inset inset solid',
                borderColor: 'rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgb(255, 255, 255)',
                borderImage: 'initial',
                height: 0,
                marginRight: 0,
                width: 0
            },
            "& .slider-row": {
                background: 'rgb(255, 255, 255)',
                boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
                flex: '0 1 auto',
                height: '100%',
                width: 2
            },
            "& .slider-button": {
                alignItems: "center",
                border: '2px solid rgb(255, 255, 255)',
                borderRadius: '100%',
                boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
                boxSizing: 'border-box',
                display: "flex",
                flex: "1 0 auto",
                height: 30,
                justifyContent: "center",
                width: 30,
                transform: 'none'
            }
        }
    }))
;
export default RootStyled;
