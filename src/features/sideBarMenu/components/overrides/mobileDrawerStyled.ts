import {styled} from "@mui/material/styles";
import {Drawer} from "@mui/material";

const MobileDrawerStyled = styled(Drawer)(({ theme }) => ({
    "& .MuiPaper-root": {
        padding: 20,
        "& .MuiList-root": {
            "& .MuiListItem-root": {
                marginBottom: 12,
                padding: 5.5,
                minWidth: 171,
                borderRadius: 6,
                "&.active": {
                    backgroundColor: `${theme.palette.primary.main}!important`,
                    "& svg": {
                        "& path": {
                            fill: theme.palette.grey[50],
                        },
                    },
                    "& .MuiListItemText-root": {
                        "& span": {
                            color: theme.palette.grey[50],
                            fontWeight: 300,
                        },
                    },
                },
                "& .MuiListItemIcon-root": {
                    minWidth: 30,
                    "& svg": {
                        width: 22,
                    },
                },
                "& .MuiListItemText-root": {
                    textAlign: "left",
                    "& span": {
                        fontFamily: "Poppins-Light",
                        fontSize: 12,
                        fontWeight: 300,
                    },
                },
            },
            "&.list-bottom": {
                position: "absolute",
                bottom: 0,
                left: 22,
            },
        },
    },
}));

export default MobileDrawerStyled
