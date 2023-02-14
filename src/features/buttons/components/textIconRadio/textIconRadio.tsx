import { Box, Radio, Typography } from "@mui/material";
import CheckRadioIcon from "@themes/overrides/icons/checkRadioIcon";
import CheckedRadioIcon from "@themes/overrides/icons/checkedRadioIcon";
import RadioButtonStyled from "./overrides/radioButtonStyled";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import React from "react";
import { IconsTypes } from "@features/calendar";
import { ModelDot } from "@features/modelDot";

function TextIconRadio({ ...props }) {
  const { item, title, color, icon, disabled, selectedValue, onChangeValue } =
    props;
  return (
    <RadioButtonStyled
      disabled={disabled}
      {...{ selectedvalue: selectedValue, uuid: item.uuid }}
      title={title}
      onClick={() => onChangeValue(item.uuid)}
      variant="contained"
      className="radio-button"
      color="primary"
      startIcon={
        <Radio
          sx={{
            "& .MuiSvgIcon-root": {
              width: "24px",
            },
            "&:hover": {
              bgcolor: "transparent",
            },
          }}
          checkedIcon={<CheckedRadioIcon />}
          icon={<CheckRadioIcon />}
          checked={selectedValue === item.uuid}
          name="radio-buttons"
          inputProps={{ "aria-label": title }}
        />
      }>
      <Box sx={{ display: "flex" }} className="text-inner">
        <ModelDot
          {...{ color, icon }}
          selected={false}
          marginRight={10}></ModelDot>
        <Typography sx={{ fontSize: "16px" }}>{title}</Typography>
      </Box>
    </RadioButtonStyled>
  );
}

export default TextIconRadio;
