// ----------------------------------------------------------------------
import IconUrl from "../urlIcon";

export default function Checkbox(theme) {
  return {
    MuiCheckbox: {
      defaultProps: {
        icon: <IconUrl path="ic_uncheck" />,
        checkedIcon: <IconUrl path="ic_check" />,
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
