import React from "react";
import {Typography} from "@mui/material";
import moment from "moment-timezone";
import {setCurrentDate, setView} from "@features/calendar";
import {useAppDispatch} from "@lib/redux/hooks";
import CalendarRowDetail from "@features/table/components/rows/calendarRowDetail";

function CalendarRow({...props}) {
    const {row, handleEvent, data, refHeader, t} = props;
    const {spinner, pendingData = null} = data;

    const dispatch = useAppDispatch();

    const handleMobileGroupClick = (date: Date) => {
        dispatch(setView("timeGridDay"));
        dispatch(setCurrentDate({date, fallback: true}));
    }

    return (
        <>
            <Typography
                variant={"inherit"}
                sx={{
                    "&:hover": {
                        textDecoration: "underline",
                        cursor: "pointer"
                    }
                }}
                onClick={() => handleMobileGroupClick(moment(row.date, "DD-MM-YYYY").toDate())}
                component="tr"
                color="text.primary"
                pt={2}
            >
                {moment(row.date, "DD-MM-YYYY").isSame(moment(new Date(), "DD-MM-YYYY")) ? (
                    "Today"
                ) : moment(row.date, "DD-MM-YYYY").isSame(moment(new Date(), "DD-MM-YYYY").add(1, 'days')) ? (
                    "Tomorrow"
                ) : (
                    <td style={{textTransform: "capitalize", position: "relative"}}>
                        {refHeader}
                        {moment(row.date, "DD-MM-YYYY").format("MMMM")}{" "}
                        {moment(row.date, "DD-MM-YYYY").format("DD")}
                    </td>
                )}
            </Typography>

            {row.events.map((data: AppointmentModel, index: number) => (<CalendarRowDetail
                key={index}
                {...{
                    index, data, pendingData,
                    spinner, t, handleEvent
                }} />))}
        </>
    );
}

export default CalendarRow;
