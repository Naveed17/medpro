
export default function Tabs(theme) {
    return {
        MuiTabs: {
            styleOverrides: {
                root: {
                    '& .MuiTab-root': {
                        color: theme.palette.grey[600],
                    },
                    '& .Mui-disabled': {
                        color: theme.palette.grey[200],
                    }
                },
            },
        },
    };
}
