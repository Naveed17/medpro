export default function Avatar(theme) {
    return {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F1F1F1',
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    fontSize: 18,
                    fontFamily: 'Poppins-Bold',
                },
            },
        },
    };
}