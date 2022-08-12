import {Box, Radio, Typography} from "@mui/material";
import CheckRadioIcon from "@themes/overrides/icons/checkRadioIcon";
import CheckedRadioIcon from "@themes/overrides/icons/checkedRadioIcon";
import RadioButtonStyled from "./overrides/radioButtonStyled";

function TextIconRadio({...props}) {
    const {title, icon, disabled, selectedValue, onChangeValue} = props;
    return (
        <RadioButtonStyled
            disabled={disabled}
            {...{selectedvalue: selectedValue, title}}
            title={title}
            onClick={() => onChangeValue(title)}
            variant="contained"
            color="primary"
            startIcon={
                <Radio
                    sx={{
                        '&:hover': {
                            bgcolor: 'transparent',
                        },
                    }}
                    checkedIcon={<CheckedRadioIcon/>}
                    icon={<CheckRadioIcon/>}
                    checked={selectedValue === title}
                    name="radio-buttons"
                    inputProps={{'aria-label': title}}
                />
            }
        >
            <Box sx={{display: "flex", svg: {mr: 1}}} className="text-inner">
                {icon}
                <Typography sx={{fontSize: "16px"}}>{title}</Typography>
            </Box>
        </RadioButtonStyled>
    );
}

export default TextIconRadio;
