// Material
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from 'next-i18next';
// ________________________
import { uniqueId } from "lodash";
import { RootStyled } from "@features/popover";
import {LoadingScreen} from "@features/loadingScreen";

function BasicPopover({ ...props }) {
    const { t, ready } = useTranslation('common');
    const { button, handleClose, open, menuList, onClickItem, ...rest } = props;
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <RootStyled>
            <ClickAwayListener onClickAway={handleClose}>
                <Box className="popover-container">
                    <Tooltip
                        {...rest}
                        PopperProps={{
                            disablePortal: true
                        }}
                        onClose={handleClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                            <div>
                                {menuList.map(
                                    (v: { title: string; icon: string; action: string }) => (
                                        <Box
                                            key={uniqueId()}
                                            onClick={() => {
                                                onClickItem(v);
                                                handleClose();
                                            }}
                                            className={`popover-item ${v.title === "delete" ? "list-delete" : ""}`}
                                        >
                                            {v.icon}
                                            <Typography fontSize={15} sx={{ color: "#fff" }}>
                                                {t(v.title)}
                                            </Typography>
                                        </Box>
                                    )
                                )}
                            </div>
                        }
                        arrow
                    >
                        {button}
                    </Tooltip>
                </Box>
            </ClickAwayListener>
        </RootStyled>
    );
}

export default BasicPopover;
