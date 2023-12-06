import React from "react";
import CardStyled from "./overrides/cardStyle";
import {
  CardContent,
  Checkbox,
  Skeleton,
  Stack,
  Theme,
  Typography,
  alpha,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
function CashoutMobileCard({ ...props }) {
  const { data, handleEvent, selected, devise } = props;
  const isItemSelected = selected.some((item: any) => item.uuid === data?.uuid)
  return (
    <CardStyled
      sx={{
        bgcolor: (theme: Theme) =>
          alpha(
            (data && data.pending && theme.palette.warning.darker) ||
              (data && data.amount > 0 && theme.palette.success.main) ||
              (data && data.amount < 0 && theme.palette.error.main) ||
              theme.palette.background.paper,
            data && data.amount === 0 ? 1 : 0.1
          ),
        cursor: data && data.collapse ? "pointer" : "default",
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": data?.uuid,
            }}
            onChange={(ev) => {
              //ev.stopPropagation()
              handleEvent(data);
            }}
            sx={{
              padding: 0,
              height: 24,
              width: 24,
            }}
          />
          <Stack ml={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              {data ? (
                <Typography
                  className="name"
                  variant="body1"
                  color="text.primary"
                >
                  {data.data.check_number}
                </Typography>
              ) : (
                <Skeleton variant="text" width={50} />
              )}
              {data ? (
                <Typography
                  className="name"
                  variant="body1"
                  color="text.primary"
                >
                  {data.data.carrier}
                </Typography>
              ) : (
                <Skeleton variant="text" width={50} />
              )}
              {data ? (
                <Typography
                  className="name"
                  variant="body1"
                  color="text.primary"
                >
                  {data.data.bank}
                </Typography>
              ) : (
                <Skeleton variant="text" width={50} />
              )}
            </Stack>
            {!data ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton width={20} height={30} />
                <Skeleton width={100} />
              </Stack>
            ) : (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  ".react-svg": {
                    svg: {
                      width: 11,
                      height: 11,
                      path: {
                        fill: (theme) => theme.palette.text.primary,
                      },
                    },
                  },
                }}
              >
                <Icon path="ic-agenda" />
                <Typography variant="body2">
                  {moment(data.data.payment_date).format("DD/MM/YYYY")}
                </Typography>
              </Stack>
            )}
          </Stack>

          {data ? (
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={600}
              sx={{ ml: "auto"}}
            >
              {data.amount} {devise}
            </Typography>
          ) : (
            <Skeleton variant="text" width={100} sx={{ ml: "auto" }} />
          )}
        </Stack>
      </CardContent>
    </CardStyled>
  );
}

export default CashoutMobileCard;
