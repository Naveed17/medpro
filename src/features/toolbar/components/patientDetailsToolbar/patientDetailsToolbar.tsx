//material-ui
import { Box, List, ListItem, IconButton, Button } from "@mui/material";
// utils
import Icon from "@themes/urlIcon";
import { styled } from "@mui/material/styles";
const EditPatient = styled(Box)(({ theme }) => ({
  // paddingTop: pxToRem(2),

  boxShadow: "-5px 14px 26px rgba(0, 150, 214, 0.37)",
  backgroundColor: "#F0FAFF",
  "& .header": {
    backgroundColor: "#fff",
    paddingRight: "24px",
    borderBottom: "1px solid #E0E0E0",
    display: "flex",
    justifyContent: "flex-end",
    "& .MuiIconButton-root": {
      minHeight: "24px" + "!important",
      "& .refresh": {
        "& svg": {
          "& path": {
            fill: theme.palette.text.primary,
          },
        },
      },
    },
    "& .MuiButton-root": {
      minHeight: "24px" + "!important",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  "& .patient-info": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .react-svg": {
      marginRight: "5px",
    },
  },
  "& .MuiTabs-root": {
    "& button": {
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5, 1),
        minWidth: "auto",
        fontSize: theme.typography.body2.fontSize,
      },
      "&.Mui-disabled": {
        color: theme.palette.grey[200],
      },
    },
  },
}));
export default function PatientDetailsToolbar() {
  return (
    <EditPatient sx={{ minWidth: { md: 648, xs: "100%" } }}>
      <Box className="header">
        <nav>
          <List sx={{ display: "flex" }}>
            <ListItem disablePadding sx={{ marginRight: "20px" }}>
              {/* <IconButton color="primary" edge="start">
                <Icon path={"ic-refrech"} className="refresh" />
              </IconButton> */}
              <Button
                variant="contained"
                color="primary"
                sx={{
                  "&.Mui-disabled": { bgcolor: "#F3F6F9", color: "#959CBD" },
                }}
                disabled
                startIcon={<Icon path="Duotone" />}
              >
                Modifier
              </Button>
            </ListItem>
            <ListItem disablePadding sx={{ marginRight: "20px" }}>
              <IconButton
                color="primary"
                edge="start"
                sx={{ path: { fill: "#000000" } }}
              >
                <Icon path={"ic-refrech"} />
              </IconButton>
            </ListItem>
            <ListItem disablePadding sx={{ marginRight: "20px" }}>
              <IconButton color="primary" edge="start">
                <Icon path={"ic-autre2"} />
              </IconButton>
            </ListItem>
            <ListItem disablePadding>
              <IconButton color="primary" edge="start">
                <Icon path="ic-x" />
              </IconButton>
            </ListItem>
          </List>
        </nav>
      </Box>
    </EditPatient>
  );
}
