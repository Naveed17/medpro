import { styled } from "@mui/material/styles";
import { ListItem } from "@mui/material/";
type Props = {
    styleprops: string;
    component?: string;
    theme?: any;
    htmlFor?: string;
}
const RootStyled = styled(ListItem)(({ theme, styleprops }: Props) => ({
    cursor: 'pointer',
    padding: theme.spacing(0.5, 1),
    '& .MuiCheckbox-root': {
        padding: '0px',
        width: '30px',
        height: '30px',
    },
    '& .MuiListItemIcon-root': {
        minWidth: '15px',
        '& .react-svg':
        {
            '&.ic-video': {
                svg: {
                    path: {
                        fill: theme.palette.error.main,
                    }
                },
            },
            svg: {
                width: theme.spacing(1.5),
                height: theme.spacing(1.5),
            },
        },
        '& .MuiSvgIcon-root': {
            width: '10px',
            height: '10px',
            color: theme.palette[styleprops].main,
        }
    },
    '& .MuiListItemText-root': {
        '& .MuiTypography-body1': {
            textTransform: 'capitalize',
        }
    }

}));
export default RootStyled;