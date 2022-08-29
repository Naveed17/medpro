// material
import {Chip, Skeleton, Button} from "@mui/material";

// styles
import {RootStyled} from "./overrides";

interface timeDataProps {
    start: string;
    end: string;
    disabled: boolean;
}

export default function TimeSlot({...props}) {
    const {
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
            direction="row"
            justifyContent="space-between"
            sx={{flexWrap: "wrap", ...sx}}
        >
            {loading ?
                [1, 2, 3, 4, 5, 6, 7, 8].map((item: number, index: number) => <Skeleton
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
                data.slice(0, limit).map((item: timeDataProps, index: number) =>
                    <Chip
                        {...rest}
                        key={`time-slot-${index}`}
                        className={value === item.start ? "active" : ""}
                        onClick={() => onChange(item.start)}
                        disabled={item.disabled}
                        label={item.start}
                        sx={{
                            mb: "8px !important",
                        }}
                    />
                )
            }
            {seeMore && (
                <Button variant="outlined"
                        onClick={OnShowMore}
                        color="primary" fullWidth>
                    {seeMoreText}
                </Button>
            )}
        </RootStyled>
    );
}
