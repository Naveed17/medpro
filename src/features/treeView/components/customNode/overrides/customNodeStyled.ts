import {styled} from '@mui/material/styles';

const CustomNodeStyled = styled('div')(({theme, property}): any => ({
    alignItems: "center",
    display: "grid",
    gridTemplateColumns: "auto auto 1fr auto",
    height: "32px",
    paddingInlineEnd: "8px",
    ".expandIconWrapper": {
        alignItems: "center",
        fontSize: 0,
        cursor: "pointer",
        display: "flex",
        height: "24px",
        justifyContent: "center",
        width: "24px",
        transition: " transform linear .1s",
        transform: "rotate(0deg)",
    },
    ".expandIconWrapper.isOpen ": {
        transform: "rotate(90deg)"
    },
    ".labelGridItem": {
        paddingInlineStart: "8px"
    }

}));

export default CustomNodeStyled;
