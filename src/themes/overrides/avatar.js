export default function Avatar(theme) {
    return {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F1F1F1',
                    width: 45,
                    height: 45,
                    borderRadius: 6,
                    fontSize: 18,
                    fontFamily: 'Poppins-Bold',
                },
            },
        },
    };
}