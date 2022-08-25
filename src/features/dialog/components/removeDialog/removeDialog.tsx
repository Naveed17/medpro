import Image from "next/image";
import { Typography } from "@mui/material";

function RemoveDialog({ ...props }) {
  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="subtitle1">
        {props.data.title}
      </Typography>
      <Typography sx={{ textAlign: "center" }} margin={2}>
        {props.data.subtitle}
      </Typography>

      <div style={{ width: "fit-content", margin: "auto" }}>
        <Image
          src={props.data.icon}
          alt={props.data.name1}
          layout="fill"
          width="30px"
        />
      </div>
      <Typography
        variant={"body1"}
        color={"primary"}
        sx={{ textAlign: "center" }}
      >
        {props.data.name1}
      </Typography>
      <Typography
        variant={"body2"}
        sx={{ textAlign: "center", color: "#7C878E" }}
      >
        {props.data.name2}
      </Typography>
    </>
  );
}
export default RemoveDialog;
