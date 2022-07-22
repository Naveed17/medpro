// material
import { Chip, Skeleton, Button } from "@mui/material";

// styles
import { RootStyled } from "./overrides";

interface timeDataProps {
  time: string;
  disabled: boolean;
}
export default function TimeSlot({ ...props }) {
  const {
    limit,
    data,
    value,
    onChange,
    loading,
    seeMore,
    seeMoreText,
    ...rest
  } = props;
  return (
    <RootStyled
      direction="row"
      justifyContent="space-between"
      sx={{ flexWrap: "wrap" }}
    >
      {data
        .slice(0, limit ? limit : 30)
        .map((item: timeDataProps, index: number) => {
          return loading ? (
            <Skeleton
              variant="rectangular"
              width={56}
              height={29}
              key={`time-slot-${index}`}
              sx={{
                width: 56,
                height: 29,
                mb: 1,
                bgcolor: (theme) => theme.palette.grey[100],
                borderRadius: "4px",
              }}
            />
          ) : (
            <Chip
              {...rest}
              key={`time-slot-${index}`}
              className={value === item.time ? "active" : ""}
              onClick={() => onChange(item.time)}
              disabled={item.disabled}
              label={item.time}
              sx={{
                mb: "8px !important",
              }}
            />
          );
        })}
      {seeMore && (
        <Button variant="outlined" color="primary" fullWidth>
          {seeMoreText}
        </Button>
      )}
    </RootStyled>
  );
}
