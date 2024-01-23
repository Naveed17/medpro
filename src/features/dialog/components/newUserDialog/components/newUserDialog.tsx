import React from 'react'
import { DialogTitle } from '@mui/material'
import DialogStyled from './overrides/dialogStyle'
import { Stepper } from '@features/stepper'
function newUserDialog() {
    return (
        <DialogStyled>
            <Stepper />
            <DialogTitle></DialogTitle>
        </DialogStyled>
    )
}

export default newUserDialog