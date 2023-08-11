import {Menu, useTheme} from "@mui/material";

function ActionMenu({children, ...props}: LayoutProps) {
    const {contextMenu, handleClose} = props as any;
    const theme = useTheme();

    return (
        <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        backgroundColor: theme.palette.text.primary,
                        "& .popover-item": {
                            padding: theme.spacing(2),
                            display: "flex",
                            alignItems: "center",
                            svg: {
                                color: "#fff",
                                marginRight: theme.spacing(1),
                                fontSize: 20
                            },
                            cursor: "pointer",
                        }
                    }
                }
            }}
            anchorPosition={
                contextMenu !== null
                    ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                    : undefined
            }
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            {children}
        </Menu>
    )
}

export default ActionMenu
