import React from 'react'
import {Typography} from '@mui/material'
import Button from "@mui/material/Button";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function SidebarCheckbox({...props}) {
    const {data, label = "text", onChange, t = null, prefix = null, checkState = false} = props

    const handleChange = (checked: any) => {
        onChange(checked)
    }

    return (
        <Button
            disableRipple
            onClick={() => handleChange(!data?.checked)}
            size={"medium"}
            color={data?.checked ? "primary" : "white"}
            sx={{
                width: "fit-content",
                p: 1,
                mx: 1,
                my: .5,
                ...(!data?.checked && {color: theme => theme.palette.text.primary})
            }}
            variant={data?.checked ? "contained" : "outlined"}
            aria-haspopup="true">
            {(data.color && typeof data.icon === "string" && !data?.checked) &&
                <FiberManualRecordIcon
                    sx={{
                        color: data.color,
                        height: 20
                    }}
                />
            }
            <Typography fontSize={12}
                        fontWeight={600}> {t ? t(`${prefix + '.' ?? ""}${data[label]}`) : data[label]}</Typography>
        </Button>
    )
}
