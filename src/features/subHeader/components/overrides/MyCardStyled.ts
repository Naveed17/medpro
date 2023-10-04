import {styled} from "@mui/system";

const MyCardStyled = styled("div")(({theme}) => ({
    borderRadius: "0.25rem",
    border: "1px solid var(--secondaire-gris-claire, #DDD)",
    background: "#FFF",
    "& .btn-header": {
        borderRadius: "0.375rem",
        border: "1px solid #DDD",
        width:"2.5rem",
        backgroundColor:'white',
        height:"2.5rem",
        marginRight: 10
    },
    '& .react-svg': {
        marginRight: theme.spacing(1),
        svg: {
            path: {
                fill: theme.palette.text.primary,
            }
        }
    },
    '& .card-icon':{
        svg: {
            path: {
                fill: "#C9C8C8",
            }
        }
    },
    '& .card-title': {
        color: "var(--secondaire-bleu-fonc, #1B2746)",
        fontFamily: 'Poppins',
        fontSize: '0.875rem',
        fontStyle: 'normal',
        fontWeight: "bold",
        lineHeight: "120%", /* 1.05rem */
    }
}));

export default MyCardStyled;
