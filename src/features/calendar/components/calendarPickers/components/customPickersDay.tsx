import {PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import {Stack, Theme, Typography} from "@mui/material";
import moment from "moment-timezone";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {highlightedDays} from "@lib/hooks";
import React from "react";

function CustomPickersDay(props: PickersDayProps<any> & {
    day_count?: any,
    is_mobile: boolean,
    theme: Theme
}) {
    const {day_count, is_mobile, theme, day, today, selected} = props;
    const note = day_count && day_count[moment(day).format('DD-MM-YYYY')];
    return (
        <PickersDay {...props}>
            <Stack alignItems={"center"} justifyContent={"center"} spacing={0} m={Boolean(is_mobile) ? 0 : 2}>
                <Typography fontSize={12} fontWeight={600}>{day.getDate()}</Typography>
                {!(today || selected) && note > 0 ?
                    <FiberManualRecordIcon
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            width: 10,
                            height: 10,
                            color: highlightedDays(note, theme)
                        }}
                    /> : undefined}
            </Stack>
        </PickersDay>
    )
}

export default CustomPickersDay;
