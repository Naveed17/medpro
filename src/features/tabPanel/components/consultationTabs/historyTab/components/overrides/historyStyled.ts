import {styled} from '@mui/material/styles';

const HistoryStyled = styled("table")(({theme}) => ({
    width: '100%',
    backgroundColor: 'rgba(255,255,255,.8)',
    padding: 10,
    marginBottom: 10,
    borderRadius:8,
    "& .col": {
        borderBottom: '1px dashed #E0E0E0',
        padding: 8
    },
    "& .data": {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold"
    },
    "& .header": {
        textAlign: "center",
        color: "grey",
        fontSize: 12,
        textTransform:"capitalize"
    },
    "& .keys": {
        fontSize: 12,
        fontWeight: "bold"
    }
}));

export default HistoryStyled