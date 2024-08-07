import {Box, Radio, Typography, useTheme} from "@mui/material";
import CheckRadioIcon from "@themes/overrides/icons/checkRadioIcon";
import CheckedRadioIcon from "@themes/overrides/icons/checkedRadioIcon";
import RadioButtonStyled from "./overrides/radioButtonStyled";
import React from "react";
import {ModelDot} from "@features/modelDot";

function TextIconRadio({...props}) {
    const {item, title, color, icon, disabled, selectedValue, onChangeValue} =
        props;
    const theme = useTheme()
    return (
        <RadioButtonStyled
            disabled={disabled}
            {...{selectedvalue: selectedValue, uuid: item.uuid}}
            title={title}
            onClick={() => onChangeValue(item.uuid)}
            variant="contained"
            className="radio-button"
            color="primary"
            startIcon={
                <Radio
                    sx={{
                        display: "none",
                        "& .MuiSvgIcon-root": {
                            width: "24px",
                        },
                        "&:hover": {
                            bgcolor: "transparent",
                        },
                    }}
                    checkedIcon={<CheckedRadioIcon/>}
                    icon={<CheckRadioIcon/>}
                    checked={selectedValue === item.uuid}
                    name="radio-buttons"
                    inputProps={{"aria-label": title}}
                />
            }>
            <Box sx={{display: "flex"}} className="text-inner">
                <ModelDot
                    {...{color}}
                    selected={false}
                    marginRight={theme.direction === "rtl" ? 0 : 10}
                    {...(theme.direction === "rtl" && {
                        style: {
                            marginLeft: 10
                        }
                    })}
                ></ModelDot>
                <Typography sx={{fontSize: "16px"}}>{title}</Typography>
            </Box>
        </RadioButtonStyled>
    );
}

export default TextIconRadio;
