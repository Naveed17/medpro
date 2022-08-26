import { useState } from "react";
import Langs from "@features/topNavBar/components/langButton/config";
import { MenuStyled, RootStyled } from "@features/topNavBar";
import { Button, Fade, ListItemText, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import Icon from '@themes/urlIcon';
import GlobeIcon from "@themes/overrides/icons/globeIcon";
import { useAppSelector } from "@app/redux/hooks";
import { configSelector } from "@features/base";
import { useRouter } from "next/router";

function LangButton() {
  const router = useRouter();
  const { locale } = useAppSelector(configSelector);
  const [anchorEl, setAnchorEl] = useState(null);
  const lang = Langs[locale];
  const [selected, setselected] = useState(lang);

  const handleClick = (event: any) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  const handleClose = ({ ...props }) => {
    setAnchorEl(null);
    if (props.locale !== undefined && selected.locale !== props.locale) {
      setselected(props);
      router.push(router.pathname, router.pathname, { locale: props.locale });
    }
  }

  return (
    <RootStyled>
      <Button
        startIcon={<GlobeIcon />}
        endIcon={
          <Icon path="ic-toogle" />
        }
        variant="outlined"
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}>
        {selected.label}

      </Button>
      <MenuStyled
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(selected[1])}
        TransitionComponent={Fade}
      >
        {Object.entries(Langs).map((item, key) => (
          <MenuItem onClick={() => handleClose(item[1])} key={item[1].locale} disableRipple>
            <Box mr={1} width={20} component="img" src={item[1].icon} />
            <ListItemText sx={{ fontSize: 12 }}>{item[1].label}</ListItemText>
          </MenuItem>
        ))}
      </MenuStyled>
    </RootStyled >
  );
}
export default LangButton;
