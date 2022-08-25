// Material
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from 'next-i18next';
// ________________________
import { uniqueId } from "lodash";
import { RootStyled } from "@features/popover";
function BasicPopover({ ...props }) {
  const { t, ready } = useTranslation('common');
  const { button, handleClose, open, menuList, onClickItem } = props;
  if (!ready) return <>loading translations...</>;
  return (
    <RootStyled>
      <ClickAwayListener onClickAway={handleClose}>
        <Box className="popover-container">
          <Tooltip
            PopperProps={{
              disablePortal: true,
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
                      className="popover-item"
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
            placement="right-start"
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
