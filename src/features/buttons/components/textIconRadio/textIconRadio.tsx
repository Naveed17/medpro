import {Box, Radio, Typography} from "@mui/material";
import CheckRadioIcon from "@themes/overrides/icons/checkRadioIcon";
import CheckedRadioIcon from "@themes/overrides/icons/checkedRadioIcon";
import RadioButtonStyled from "./overrides/radioButtonStyled";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import React from "react";

function TextIconRadio({...props}) {
    const {item, title, color, icon, disabled, selectedValue, onChangeValue} = props;
    return (
        <RadioButtonStyled
            disabled={disabled}
            {...{selectedvalue: selectedValue, uuid: item.uuid}}
            title={title}
            onClick={() => onChangeValue(item.uuid)}
            variant="contained"
            color="primary"
            startIcon={
                <Radio
                    sx={{
                        "& .MuiSvgIcon-root": {
                            width: "24px"
                        },
                        '&:hover': {
                            bgcolor: 'transparent',
                        },
                    }}
                    checkedIcon={<CheckedRadioIcon/>}
                    icon={<CheckRadioIcon/>}
                    checked={selectedValue === item.uuid}
                    name="radio-buttons"
                    inputProps={{'aria-label': title}}
                />
            }
        >
            <Box sx={{display: "flex", svg: {mr: 1}}} className="text-inner">
                <FiberManualRecordIcon
                    className={'motif-circle'}
                    sx={{
                        background: "white",
                        border: .1,
                        borderColor: 'divider',
                        borderRadius: '50%',
                        p: 0.05,
                        color: color
                    }}
                />
                {/*{icon}*/}
                <Typography sx={{fontSize: "16px"}}>{title}</Typography>
            </Box>
        </RadioButtonStyled>
    );
}

export default TextIconRadio;
