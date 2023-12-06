import {Stack} from "@mui/material";
import {PaletteColor, styled} from "@mui/material/styles";

const MedicalPrescriptionModelDialogStyled = styled(Stack)(({theme, ...styleprops}) => ({
    ...(styleprops?.color && {
        "& .Mui-checked": {
            svg: {
                path: {
                    fill: (theme.palette[styleprops.color as keyof typeof theme.palette] as PaletteColor).main
                }
            },
        }
    }),
    "& .MuiListItem-root": {
        paddingTop: 0,
        paddingBottom: 0
    },
    "& .ic-add": {
        marginRight: theme.spacing(0.5),
        svg: {
            width: 16,
            height: 16,
            ...(styleprops?.color && {
                path: {
                    fill: (theme.palette[styleprops.color as keyof typeof theme.palette] as PaletteColor).main,
                }
            })
        },
    },
}));
export default MedicalPrescriptionModelDialogStyled;
