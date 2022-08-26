import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export default function ThemeColorPicker({ color, onSellectColor }) {
  // const colors = ['primary', 'secondary', 'error', 'success', 'info', 'warning'];
  const colors = [
    "#0696D6",
    "#24388A",
    "#E83B68",
    "#1BC47D",
    "#F0F7FA",
    "#FFD400",
  ];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [colorCode, setColorCode] = React.useState([]);
  const [selectedColor, setSelectedColor] = React.useState(color);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (prop) => {
    onSellectColor(prop);
    setSelectedColor(prop);
    setAnchorEl(null);
  };
  React.useEffect(() => {
    setColorCode(colors);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box>
      <Box
        id="basic-button"
        variant="contained"
        sx={{
          height: "38px",
          minWidth: "43px",
          borderRadius: 1,
          backgroundColor: selectedColor,
        }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(selectedColor)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {colorCode.map((color) => (
          <MenuItem key={color} onClick={() => handleClose(color)}>
            <div style={{ backgroundColor: color, height: 20, width: 20 }} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
