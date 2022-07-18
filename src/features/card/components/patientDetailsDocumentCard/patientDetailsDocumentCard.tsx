import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import CodeIcon from "@mui/icons-material/Code";
interface Props {
  lable: string;
  icon: React.ReactElement | null;
}
const RootStyle = styled("div")(({ theme }) => ({
  "& .menu-btn": {
    marginBottom: theme.spacing(1.5),
  },
  "& .MuiButton-root": {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    backgroundColor: "#F9F9FB",
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    minWidth: 100,
    fontSize: 12,

    width: "100%",
    ".MuiButton-startIcon>*:nth-of-type(1)": {
      fontSize: 13,
    },
    ".MuiButton-endIcon>*:nth-of-type(1)": {
      fontSize: 12,
    },
    "& .MuiButton-endIcon": {
      marginLeft: "auto",
    },
    "&:hover": {
      boxShadow: theme.customShadows.callanderButton,
    },
  },
}));

function CallanderButton({ ...props }) {
  const { data, onSellected, ...rest } = props;
  const [width, setWidth] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selected, setselected] = React.useState(data[0]);
  const ref = React.useRef<HTMLButtonElement>(null);
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  function handleClose(prop: Props) {
    setAnchorEl(null);
    setselected(prop);
    onSellected(prop?.lable);
  }
  React.useEffect(() => {
    if (ref.current) {
      const element = ref.current?.getBoundingClientRect();
      setWidth(element.width);
    }
    onSellected(selected?.lable);
  }, []);
  return (
    <RootStyle>
      <Button
        ref={ref}
        startIcon={selected.icon}
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
        onClick={handleClick}
        onMouseOver={handleClick}
        className="menu-btn"
      >
        {selected.lable}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(selected)}
        MenuListProps={{ onMouseLeave: () => handleClose(selected) }}
        TransitionComponent={Fade}
        sx={{
          "& .MuiList-root": {
            width: width,
            py: 0,
            boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.06)",
            "& .MuiMenuItem-root": {
              px: 1,
              py: 1.44,
              "& .MuiTypography-root": {
                fontSize: 12,
                color: "#7C878E",
              },
              "& .MuiListItemIcon-root": {
                minWidth: "20px",
              },
              "&:not(:last-of-type)": {
                borderBottom: "1px solid #E3EAEF",
              },
            },
            "& svg": {
              fontSize: 13,
            },
          },
        }}
      >
        {data.map((item: Props) => (
          <MenuItem onClick={() => handleClose(item)} key={item.lable}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText sx={{ fontSize: 12 }}>{item.lable}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </RootStyle>
  );
}

export default CallanderButton;
