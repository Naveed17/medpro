import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";
const CollapseCardStyled = styled(Paper)(({ theme }) => {
    return {
        transition: theme.transitions.create(['width', 'all'], {
            duration: theme.transitions.duration.standard,
        }),
        minWidth: "42px",
        width: '100%',
        marginLeft: 0,
        overflowY: "auto",
        overflowX: "hidden",
        boxShadow: "none",
        '& .label': {
            color: theme.palette.text.primary,
            textTransform: "capitalize",
            '& .react-svg': {
                marginRight: 10
            },
            svg: {
                marginRight: 1,
                width: 14,
                height: 14,
                path: {
                    fill: theme.palette.text.primary,
                },
            },

        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        }
    }
});
export default CollapseCardStyled;