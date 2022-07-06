import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import Typography from "@mui/material/Typography";
import { Checkbox } from "@mui/material";
import { useTheme } from "@mui/material/styles";
export default function TextIconRadio(props) {
  const { doctor, disabled, onChange, ...rest } = props;
  const theme = useTheme();

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
          border: `1px solid ${theme.palette.divider}`,
          ...(!disabled
            ? {
              bgcolor: theme.palette.background.paper,
              color: "text.primary",
              textTransform: "capitalize",
              "& .MuiButton-startIcon": {
                mr: 0,
              },
              "&:hover, &:focus ": {
                bgcolor: theme.palette.common.white,
                boxShadow: "none",
              },
            }
            : {
              "&.Mui-disabled": {
                bgcolor: theme.palette.grey[100],
                color: theme.palette.grey[300],
                border: `1px solid ${theme.palette.divider}`,
              },
            }),
        }}>
        <Checkbox
          size="small"
          checked={doctor.selected}
          id={doctor.id} />
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
