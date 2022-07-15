import {styled} from "@mui/material/styles";
import {Form} from "formik";

const FormStyled = styled(Form)(({ theme }) => ({
    '& .MuiCard-root': {
        border: 'none',
        marginBottom: theme.spacing(2),
        '& .MuiCardContent-root': {
            padding: theme.spacing(3, 2),
            paddingRight: theme.spacing(5),
        }
    },
    '& .form-control': {
        '& .MuiInputBase-root': {
            paddingLeft: theme.spacing(0.5),
            "& .MuiInputBase-input": {
                paddingLeft: 0
            },
            '& .MuiInputAdornment-root': {
                "& .MuiOutlinedInput-root": {
                    border: 'none',
                    fieldset: {
                        border: "1px solid transparent",
                        boxShadow: "none",
                    },
                    background: "transparent",
                    "&:hover": {
                        fieldset: {
                            border: "1px solid transparent",
                            boxShadow: "none",
                        },
                    },
                    "&.Mui-focused": {
                        background: "transparent",
                        fieldset: {
                            border: "1px solid transparent",
                            boxShadow: "none",
                            outline: "none",
                        },
                    },
                },
            },
        },
    },
    '& .bottom-section': {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(-2),
        position: 'fixed',
        bottom: 0,
        left:0,
        zIndex: 999,
        width:'100%',
        borderTop:'3px solid #f0fafe'
    }
}));
export default FormStyled