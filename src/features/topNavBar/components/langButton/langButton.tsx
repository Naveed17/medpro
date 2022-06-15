import {useState} from "react";
import Langs from "@features/topNavBar/components/langButton/config";
import {MenuStyled, RootStyled} from "@features/topNavBar";
import {Button, Fade, ListItemText, MenuItem} from "@mui/material";
import {Box} from "@mui/system";
import CodeIcon from "@mui/icons-material/Code";
import GlobeIcon from "@themes/overrides/icons/globeIcon";

function LangButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setselected] = useState(Langs[0]);

  const handleClick = (event: any) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  const handleClose= (props: any) => {
    setAnchorEl(null);
    setselected(props);
    console.log(props);
  }

  return (
      <RootStyled>
        <Button
            startIcon={<GlobeIcon />}
            endIcon={
              <CodeIcon
                  sx={{
                    transform: "rotate(90deg)",
                  }}
              />
            }
            variant="outlined"
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={handleClick}>
          {selected.lable}

        </Button>
        <MenuStyled
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleClose(selected)}
            TransitionComponent={Fade}
        >
          {Langs.map(item => (
              <MenuItem onClick={() => handleClose(item)} key={item.lable} disableRipple>
                <Box mr={1} width={20} component="img" src={item.icon} />
                <ListItemText sx={{ fontSize: 12 }}>{item.lable}</ListItemText>
              </MenuItem>
          ))}
        </MenuStyled>
      </RootStyled >
  );
}
export default LangButton;
