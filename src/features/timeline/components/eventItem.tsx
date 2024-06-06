import {
    ProgramItem,
    useProgram,
} from "planby";
import {Card, CardContent, Typography, useTheme} from "@mui/material";
import {useAppSelector} from "@lib/redux/hooks";
import {timeLineSelector} from "@features/timeline";

const EventItem = ({program, ...rest}: any) => {
    const theme = useTheme();
    const {styles, formatTime, set12HoursTimeFormat} = useProgram({
        program,
        ...rest,
    });

    const {showDetails: showTimeLineDetails} = useAppSelector(timeLineSelector);

    const {data} = program;
    const {index, title, overlapEventIndex, till, overlapEvent} = data;
    const leftOffset = 100;
    const heightOffset = showTimeLineDetails ? 6 : 10;

    return (
        <Card
            sx={{
                ...styles.position,
                left: styles.position.left + leftOffset,
                //top: styles.position.top + (overlapEvent && index > 1 ? ((index - (overlapEventIndex - 1)) * (styles.position.height - heightOffset)) : 0),
                boxShadow: "none",
                border: "none",
                position: 'absolute',
                borderRadius: 20,
                height: showTimeLineDetails ? 30 : 22,
                background: theme.palette.grey['100'],
                opacity: 0.6,
                marginBottom: showTimeLineDetails ? 1.2 : 0.8
            }}>
            {showTimeLineDetails && <CardContent sx={{padding: "6px 10px"}}>
                <Typography className={"timer-text ellipsis"} fontSize={12}>{title}</Typography>
            </CardContent>}
        </Card>
    );
};

export default EventItem;
