import {styled} from "@mui/material/styles";
import {Card} from '@mui/material'

const TemplateStyled = styled(Card)(({theme}) => ({
    border: 'none',
    ".MuiCardContent-root": {
        padding: theme.spacing(2),
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: theme.spacing(3),
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
        [theme.breakpoints.between("sm", "md")]: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
        },
        "& > .portraitA4": {
            minHeight: 400,
            [theme.breakpoints.down("md")]: {
                width: '100%',
                marginRight: '0 !important',

            },
            [theme.breakpoints.between("sm", "md")]: {
                height: 'calc(100% - 200px)',
                marginBottom: 0,
            },
        },
        "& .container": {
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(2),
            borderRadius: 6,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: 'center',
            minHeight: 168,
            ".portraitA4": {
                minHeight: 400,
                [theme.breakpoints.down("md")]: {
                    width: '100%',
                    margin: '0 !important',


                },

            },
            "& div": {
                width: '100%',
            },
            [theme.breakpoints.down("md")]: {
                width: '100%',
                padding: 0,

            },
        },
        "& .heading": {
            display: "inline-block",
            marginLeft: 6,
            padding: "2px 4px",
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            textTransform: "uppercase",
            fontSize: 12,
            width: "fit-content",
            height: "fit-content",
            lineHeight: 1,
            letterSpacing: .3,
            fontWeight: 600
        },
        "& .doc-title": {
            fontSize: 10
        },
        "& .portraitA4": {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(3, 2),
            zoom: "18%",
            margin: 0,
            transform: 'scale(.9)',
            '&:hover': {
                boxShadow: "0 8px 36px rgba(152,180,234,.19), 0 11px 33px rgba(122,152,210,.12)"
            },
            [theme.breakpoints.down("md")]: {
                zoom: '100%'

            },
        },
        "& .edit-btn": {
            position: "absolute",
            left: '50%',
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 999
        },
        "& .title-content": {
            width: "100%",
            justifyContent: 'space-between',
            alignItems: "center"
        },
        "& .empty-preview": {
            fontSize: 12,
            fontWeight: 600,
            width: "100%",
        },
        "& .title": {
            fontSize: 12,
            fontWeight: 600,
            overflow: "hidden",
            marginLeft: 4,
            display: "-webkit-box",
            width: "100%",
            maxWidth: 110,
            "-webkit-line-clamp": "1",
            "-webkit-box-orient": "vertical"
        },
        "& .color-content": {
            marginLeft: "auto",
            width: 15,
            height: 15,
            borderRadius: 8
        },
        ".portraitA4.MuiBox-root": {
            [theme.breakpoints.down("md")]: {
                width: '100%',
                margin: '0 !important',
                minHeight: 400,

            },
            [theme.breakpoints.between("sm", "md")]: {
                height: 'calc(100% - 200px)',
                marginBottom: 0,
            },
        },
        ".add-doc-wrapper": {
            ".portraitA4": {
                minHeight: 1300,
                [theme.breakpoints.down("md")]: {
                    minHeight: 400,
                    borderRadius: '6px !important',

                }
            }
        }
    }
}));

export default TemplateStyled;
