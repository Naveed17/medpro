import { Stack, Typography } from "@mui/material";
import { Player } from "@lottiefiles/react-lottie-player";
import React, { memo } from "react";
const LottiePlayer: any = memo(({ src, ...props }: any) => {
  return <Player src={src} {...props} />;
});
LottiePlayer.displayName = "lottie-player";
function AddVisitorDialog({ ...props }) {
  const { t } = props;
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      minHeight={300}
      maxWidth={"90%"}
      mx={"auto"}>
      <LottiePlayer
        autoplay
        keepLastFrame
        src="/static/lotties/check-mark-success.json"
        style={{ height: "133px", width: "133px" }}
      />
      <Typography variant="h6" mt={0.5}>
        {t("visitor_added")}
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa,
        officiis, repellat voluptatum doloribus
      </Typography>
    </Stack>
  );
}

export default AddVisitorDialog;
