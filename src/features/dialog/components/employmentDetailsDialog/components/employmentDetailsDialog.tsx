import { Stack, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AgendaIcon from '@themes/overrides/icons/agendaIcon';
import DatePickerIcon from '@themes/overrides/icons/datePickerIcon';
import WeekIcon from '@themes/overrides/icons/weekIcon';
import React, { useState } from 'react'

function EmploymentDetailsDialog({ ...props }) {
    const { data: { t } } = props;
    const [date, setDate] = useState<any>({
        startDate: "",
        endDate: ""
    })
    return (
        <Stack direction='row' spacing={2}>
            {["startDate", "endDate"].map((item: string, idx: number) => (
                <Stack width={1} key={idx}>
                    <Typography>
                        {t(`dialog.${item}`)}
                        <Typography variant='caption' color='error'>*</Typography>
                    </Typography>
                    <LocalizationProvider
                        dateAdapter={AdapterDateFns}>
                        <DatePicker
                            components={{
                                OpenPickerIcon: DatePickerIcon
                            }}
                            renderInput={(props) =>
                                <TextField

                                    fullWidth size={"small"} {...props} />}
                            inputFormat={"dd-MM-yyyy"}
                            value={date[item] || ""}
                            onChange={(newValue) => {
                                setDate({ ...date, [item]: newValue });
                            }}

                        />
                    </LocalizationProvider>
                </Stack>
            ))}

        </Stack>
    )
}

export default EmploymentDetailsDialog