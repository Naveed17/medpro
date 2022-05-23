// ----------------------------------------------------------------------
import Icon from "@themes/icon";
export default function Checkbox(theme) {
  return {
    MuiCheckbox: {
      defaultProps: {
        icon: <Icon path="ic_uncheck" />,
        checkedIcon: <Icon path="ic_check" />,
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          height: 36,
          width: 36,
        },
      },
    },
  };
}
