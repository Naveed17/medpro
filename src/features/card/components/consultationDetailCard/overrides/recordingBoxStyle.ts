import {styled} from "@mui/material/styles";
import {Stack} from "@mui/material";
import ConsultationDetailCardStyled
    from "@features/card/components/consultationDetailCard/overrides/consultationDetailCardStyle";

const RecondingBoxStyle = styled(Stack)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.25em',
    borderRadius: '0.5em',
    backgroundColor: '#0796d6',
    width: '85px',
    cursor: 'pointer',
    '.recording-circle': {
        backgroundColor: 'red',
        width: '0.7em',
        height: '0.7em',
        borderRadius: '50%',
        animation: 'ease pulse 1s infinite',
        marginRight: '0.2em'
    },
    '.recording-text': {
        fontSize: '0.75em',
        color: 'white'
    },
    '@keyframes pulse': {
        '0%': {backgroundColor: "red"},
        '50%': {backgroundColor: '#f06c6c'},
        '100%': {backgroundColor: 'red'}
    }
}));
export default RecondingBoxStyle;