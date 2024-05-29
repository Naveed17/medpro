import {
    TimelineWrapper,
    TimelineBox,
    TimelineTime,
    TimelineDivider,
    TimelineDividers,
    useTimeline,
} from "planby";
import {useTheme} from "@mui/material";

interface TimelineProps {
    isBaseTimeFormat: boolean;
    isSidebar: boolean;
    dayWidth: number;
    hourWidth: number;
    numberOfHoursInDay: number;
    offsetStartHoursRange: number;
    sidebarWidth: number;
}


function PlanByTimeline({
                            isBaseTimeFormat,
                            isSidebar,
                            dayWidth,
                            hourWidth,
                            numberOfHoursInDay,
                            offsetStartHoursRange,
                            sidebarWidth,
                        }: TimelineProps) {
    const theme = useTheme();
    const {time, dividers, formatTime} = useTimeline(
        numberOfHoursInDay,
        isBaseTimeFormat
    );

    const renderTime = (index: number) => (
        <TimelineBox key={index} width={hourWidth}>
            <TimelineTime>
                {formatTime(index + offsetStartHoursRange).toLowerCase()}
            </TimelineTime>
            <TimelineDividers>{renderDividers()}</TimelineDividers>
        </TimelineBox>
    );

    const renderDividers = () =>
        dividers.map((_, index) => (
            <TimelineDivider key={index} width={hourWidth}/>
        ));

    return (
        <TimelineWrapper
            style={{
                margin: "12px 0 10px",
                background: theme.palette.grey['50'],
                padding: "0 3.1rem",
                borderRadius: 8,
                zIndex: 9,
                lineHeight: 0,
                height: 46
            }}
            dayWidth={dayWidth}
            sidebarWidth={sidebarWidth}
            isSidebar={isSidebar}>
            {time.map((_, index) => renderTime(index))}
        </TimelineWrapper>
    );
}

export default PlanByTimeline;
