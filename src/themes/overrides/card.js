
// ----------------------------------------------------------------------

export default function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: theme.shadows[2],
                    borderRadius: 10,
                    ".MuiCardContent-root": {
                        '&:last-child': {
                            paddingBottom: theme.spacing(2)
                        }
                    }
                },
            },
        }
    }
}