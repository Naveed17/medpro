import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import Typography from "@mui/material/Typography";
import {Checkbox} from "@mui/material";
export default function TextIconRadio(props) {
  const { doctor,disabled, onChange, ...rest } = props;

  return (
    <div>
      <Button
        {...rest}
        onClick={() => onChange(doctor)}
        disableRipple
        variant="contained"
        color="secondary"
        sx={{
          justifyContent: "flex-start",
          padding: "1.2rem 0.75rem",
          border: "1px solid #DDDDDD",
          ...(!disabled
            ? {
              bgcolor: "#fff",
              color: "text.primary",
              textTransform: "capitalize",
              "& .MuiButton-startIcon": {
                mr: 0,
              },
              "&:hover, &:focus ": {
                bgcolor: "#fff",
                boxShadow: "none",
              },
            }
            : {
              "&.Mui-disabled": {
                bgcolor: "#F1F1F1",
                color: "#C9C8C8",
                border: "1px solid #DDDDDD",
              },
            }),
        }}>
          <Checkbox
              size="small"
              checked={doctor.selected}
              id={doctor.id}/>
        <Box
          sx={{ display: "flex", svg: { mr: 1 }, div: { height: "100%" } }}
          className="text-inner">
            <img src={doctor.img} alt={doctor.img} width={38} height={38} />
          <Box sx={{ ml: 1 }}>
            <Typography
              variant="subtitle2"
              color="text.primary"
              fontWeight={600}
              lineHeight={1.3}
              sx={{ textAlign: "left" }}>
              {doctor.name}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={400}
              color="text.primary"
              sx={{ textAlign: "left" }}>
              {doctor.speciality}
            </Typography>
          </Box>
        </Box>
      </Button>
    </div >
  );
}
