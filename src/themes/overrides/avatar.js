export default function Avatar(theme) {
    return {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.grey[100],
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    fontSize: 18,
                    fontWeight: 600,
                    boxShadow: theme.customShadows.avatarShadow
                },
            },
        },
    };
}