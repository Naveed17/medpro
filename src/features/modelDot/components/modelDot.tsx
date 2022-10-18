import { Stack, useTheme } from "@mui/material";
import React from "react";
function ModelDot({ ...DotProps }) {
  const theme = useTheme();
  const {
    color,
    selected,
    onClick,
    size = 32,
    sizedot = 20,
    padding = 5,
    marginRight = 0,
    icon,
  } = DotProps;
  return (
    <div
      onClick={onClick}
      style={{
        boxSizing: "border-box",
        display: "flex",
        background: "white",
        flexDirection: "row",
        alignItems: "flex-start",
        padding: selected ? 4 : padding,
        gap: 10,
        marginRight,
        width: size,
        height: size,
        border: selected ? "2px solid #0696D6" : "1px solid #EAEAEA",
        borderRadius: 30,
        flex: "none",
        order: 0,
        flexGrow: 0,
      }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          ".MuiSvgIcon-root": {
            width: 14,
            height: 14,
            path: {
              fill: theme.palette.grey[0],
            },
          },
        }}
        style={{
          width: sizedot,
          height: sizedot,
          borderRadius: 30,
          background: color,
          flex: "none",
          order: 0,
          flexGrow: 0,
        }}>
        {icon && icon}
      </Stack>
    </div>
  );
}

export default ModelDot;
