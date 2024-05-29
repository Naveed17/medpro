import { SuccessCard } from '@features/card'
import { Stack } from '@mui/material'
import React from 'react'

function Step3({ ...props }) {
    const { t } = props;

    return (
        <Stack sx={{
            h6: {
                textAlign: 'center'
            }
        }}>
            <SuccessCard
                data={{
                    title: t("dialog.success_title"),
                    description: t("dialog.success_desc")
                }}
            />
        </Stack>
    )
}

export default Step3