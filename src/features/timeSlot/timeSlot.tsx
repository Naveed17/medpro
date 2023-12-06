// material
import {Chip, Skeleton, Button, Badge, Typography} from "@mui/material";
// styles
import {RootStyled} from "./overrides";

export default function TimeSlot({...props}) {
    const {
        t,
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
                               color="primary">
                            <Chip
                                {...rest}
                                className={value === item.start ? "active" : ""}
                                onClick={() => onChange(item.start, index)}
                                disabled={item.disabled}
                                label={item.start}
                                sx={{
                                    mb: "8px !important",
                                }}
                            />
                        </Badge>)
                    :
                    <Typography textAlign={"center"} my={8}
                                fontWeight={600}>{t('stepper-1.slots-unavailable')}</Typography>
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
