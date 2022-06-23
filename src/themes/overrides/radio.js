// ----------------------------------------------------------------------
import Icon from "@themes/urlIcon";

export default function Radio(theme) {
  return {
    MuiRadio: {
      defaultProps: {
        checkedIcon: <Icon path="ic_check-primary" />,
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          width: 36,
          height: 36,
          svg: {
            width: 19,
            color: "#DDDDDD",
          },
          "& .MuiTypography-root": {
            fontSize: 12,
          },
        },
      },
    },
  };
}
