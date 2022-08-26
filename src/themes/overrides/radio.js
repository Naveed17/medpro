import IconUrl from "../urlIcon";

export default function Radio(theme) {
  return {
    MuiRadio: {
      defaultProps: {
        checkedIcon: <IconUrl path="ic_check-primary" />,
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          width: 36,
          height: 36,
          svg: {
            width: 19,
            color: theme.palette.divider,
          },
          "& .MuiTypography-root": {
            fontSize: 12,
          },
        },
      },
    },
  };
}
