import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import FilterStyled from "./overrides/filterStyle";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Filter({ ...props }) {
  const { data, title, handleClose, open, children } = props;

  return (
    <>
      <FilterStyled
        fullScreen
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
      >
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              color="primary"
              onClick={() => handleClose()}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography color="text.primary" variant="h6" component="div">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box p={2}>{children || data}</Box>
      </FilterStyled>
    </>
  );
}
