import {styled} from "@mui/system";

const MyCardStyled = styled("div")(({theme}) => ({
    borderRadius: "0.25rem",
    border: "1px solid var(--secondaire-gris-claire, #DDD)",
    background: "#FFF",
    "& .btn-header": {
        borderRadius: "0.375rem",
        border: "1px solid #DDD",
        width: "2.5rem",
        backgroundColor: 'white',
        height: "2.5rem",
        marginRight: 10
    },
    "& .btn-full": {
        borderRadius: "1rem",
        width: "2rem",
        height: "2rem",
        '& .react-svg': {
            marginRight: 0,
        }
    },
    "& .bookmark": {
        width: 24,
        height: 24,
        backgroundColor: '#F9F9FB',
        borderRadius: 20,
        border: "1px solid #DDD",
        marginRight: 10
    },
    '& .card-icon': {
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
