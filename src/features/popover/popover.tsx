import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { uniqueId } from "lodash";
export default function BasicPopover({ ...props }) {
  const { button, handleClose, open, menuList, onClickItem } = props;

  return (
    <div>
      <ClickAwayListener onClickAway={handleClose}>
        <Box
          sx={{
            "& .MuiTooltip-popper": {
              overflow: "initial",
              minWidth: 208,
              "& .MuiTooltip-tooltip": {
                bgcolor: "#1B2746",

                "&.MuiTooltip-tooltipPlacementLeft": {
                  ml: 1,
                },
                "&.MuiTooltip-tooltipPlacementRight": {
                  mr: 1,
                },
                "& .MuiTooltip-arrow": {
                  color: "#1B2746",
                },
              },
            },
          }}
        >
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
                {menuList.map((v) => (
                  <Box
                    key={uniqueId()}
                    onClick={() => {
                      onClickItem(v);
                      handleClose();
                    }}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      svg: { color: "#fff", mr: 1, fontSize: 20 },
                      cursor: "pointer",
                    }}
                  >
                    {v.icon}
                    <Typography fontSize={15} sx={{ color: "#fff" }}>
                      {v.title}
                    </Typography>
                  </Box>
                ))}
              </div>
            }
            placement="right-start"
            arrow
          >
            {button}
            {/* <IconButton
              onClick={handleTooltipOpen}
              size="small"
              className="more-icon-btn"
              sx={{ width: 22, height: 22 }}
            >
              <MoreVertRoundedIcon fontSize="small" />
            </IconButton> */}
          </Tooltip>
        </Box>
      </ClickAwayListener>
    </div>
  );
}
