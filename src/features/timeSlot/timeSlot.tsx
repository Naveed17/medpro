// material
import {Chip, Skeleton, Button, Badge, Typography, useTheme} from "@mui/material";
// styles
import {RootStyled} from "./overrides";
import {alpha, PaletteColor} from "@mui/material/styles";

export default function TimeSlot({...props}) {
    const {
        t,
        prefixTranslation = null,
        limit = 30,
        sx,
        data,
        value,
        onChange,
        loading,
        seeMore,
        seeMoreText,
        OnShowMore,
        ...rest
    } = props;
    const theme = useTheme();

    return (
        <RootStyled
            className={"time-slot-container"}
            direction="row"
            justifyContent="space-between"
            sx={{flexWrap: "wrap", ...sx}}>
            {loading ?
                Array.from(Array(limit).keys()).map((item: number, index: number) => <Skeleton
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
                />)
                :
                data.length > 0 ?
                    data?.slice(0, limit).map((item: TimeSlotModel, index: number) =>
                        <Badge key={`time-slot-${index}`}
                               sx={{
                                   '& .MuiBadge-badge': {
                                       border: `3px solid`,
                                       padding: '0 4px',
                                       fontSize: "10px"
                                   }
                               }}
                               badgeContent={item.appointments}
                               invisible={item.appointments === 0}
                               color="error">
                            <Chip
                                {...rest}
                                className={value === item.start ? "active" : ""}
                                onClick={() => onChange(item.start, index)}
                                disabled={item.disabled}
                                label={item.start}
                                sx={{
                                    mb: "8px !important",
                                    ...(item.appointments > 0 && {
                                        color: (theme?.palette["error"] as PaletteColor)["light"],
                                        backgroundColor: alpha((theme?.palette["error" as keyof typeof theme.palette] as PaletteColor).main, 0.16),
                                    })
                                }}
                            />
                        </Badge>)
                    :
                    <Typography textAlign={"center"} my={8}
                                fontWeight={600}>{t(`${prefixTranslation ?? ""}stepper-1.slots-unavailable`)}</Typography>
            }
            {seeMore && (
                <Button variant="text"
                        onClick={OnShowMore}
                        color="primary" fullWidth>
                    {seeMoreText}
                </Button>
            )}
        </RootStyled>
    );
}
