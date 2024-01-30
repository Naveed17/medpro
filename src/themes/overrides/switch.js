// ----------------------------------------------------------------------
export default function Switch(theme) {
  return {
    MuiSwitch: {
      styleOverrides: {
        root: {
          thumb: {
            boxShadow: "none",
          },
          track: {
            opacity: 1,
            backgroundColor: theme.palette.common.white,
            borderColor: theme.palette.divider,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: 20 / 2,
          },
          switchBase: {
            left: 0,
            right: "auto",
            "&.Mui-checked+.MuiSwitch-track": {
              backgroundColor: theme.palette.common.white,
            },
            "&:not(.Mui-checked)": {
              color: theme.palette.grey[400],
            },

          },
          "&.custom-switch": {
            padding: 8,
            '& .MuiSwitch-track': {
              borderRadius: 22 / 2,
              backgroundColor: theme.palette.divider,
              opacity: 1,
              border: `1px solid ${theme.palette.common.white}`,

              '&:after': {
                content: '""',
                position: 'absolute',
                top: 12,
                width: 16,
                height: 16,
                backgroundImage: `url('data:image/svg+xml;utf8,<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6.43332" r="5" stroke="white" stroke-width="2"/></svg>')`,
                right: 9,
                backgroundRepeat: 'no-repeat',
              },
            },
            '& .MuiSwitch-thumb': {
              boxShadow: 'none',
              backgroundColor: theme.palette.common.white,
              width: 16,
              height: 16,
              margin: 2,
            },
          },
        }
      },
    },
  };
}
