import {Box, Radio, Typography} from "@mui/material";
import CheckRadioIcon from "@themes/overrides/icons/checkRadioIcon";
import CheckedRadioIcon from "@themes/overrides/icons/checkedRadioIcon";
import RadioButtonStyled from "./overrides/radioButtonStyled";

function TextIconRadio({...props}) {
    const {item, title, icon, disabled, selectedValue, onChangeValue} = props;
    return (
        <RadioButtonStyled
            disabled={disabled}
            {...{selectedvalue: selectedValue, id: item.id}}
            title={title}
            onClick={() => onChangeValue(item.id)}
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
                    checked={selectedValue === item.id}
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
