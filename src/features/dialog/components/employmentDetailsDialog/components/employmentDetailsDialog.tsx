import {Stack, TextField, Typography} from '@mui/material'
import {DatePicker} from '@mui/x-date-pickers';
import DatePickerIcon from '@themes/overrides/icons/datePickerIcon';
import React, {useState} from 'react'

function EmploymentDetailsDialog({...props}) {
    const {data: {t}} = props;
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
                    <DatePicker
                        slots={{
                            openPickerIcon: DatePickerIcon
                        }}
                        slotProps={{textField: {size: "small"}}}
                        format={"dd-MM-yyyy"}
                        value={date[item] || ""}
                        onChange={(newValue) => {
                            setDate({...date, [item]: newValue});
                        }}
                    />
                </Stack>
            ))}
        </Stack>
    )
}

export default EmploymentDetailsDialog
