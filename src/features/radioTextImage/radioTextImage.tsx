import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import Typography from "@mui/material/Typography";
export default function TextIconRadio({ ...props }) {
  const { name, image, type, disabled, value, onChange, ...rest } = props;
  return (
    <div>
      <Button
        disabled={disabled}
        {...rest}
        onClick={() => onChange(value === name ? value : name)}
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
        }}
        startIcon={
          value !== name ? (
            <CircleOutlinedIcon
              sx={{ mr: disabled ? 0 : 1, color: "#C9C8C8" }}
            />
          ) : (
            <Fade in={value === name}>
              <CheckCircleRoundedIcon
                sx={{
                  mr: disabled ? 0 : 1,
                  color: (theme) => theme.palette.primary.main,
                }}
              />
            </Fade>
          )
        }
      >
        <Box
          sx={{ display: "flex", svg: { mr: 1 }, div: { height: "100%" } }}
          className="text-inner"
        >
          <img src={image} alt={image} width={38} height={38} />

          <Box sx={{ ml: 1 }}>
            <Typography
              variant="subtitle2"
              color="text.primary"
              fontWeight={600}
              lineHeight={1.3}
              sx={{ textAlign: "left" }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={400}
              color="text.primary"
              sx={{ textAlign: "left" }}
            >
              {type}
            </Typography>
          </Box>
        </Box>
      </Button>
    </div>
  );
}
