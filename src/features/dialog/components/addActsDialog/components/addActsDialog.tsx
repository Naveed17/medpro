import { Box, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import AddActsDialogStyle from './overrides/addActsDialogStyle'
import { uniqueId } from 'lodash'
function AddActsDialog({ ...props }) {
    const { data: { stateAct, setstateAct, t } } = props;
    return (
        <AddActsDialogStyle spacing={2} justifyContent="center" height="100%">
            <Box width="100%">
                <Typography gutterBottom>
                    {t('name_of_act')}
                </Typography>
                <TextField fullWidth
                    placeholder={t('name_of_act')}
                    onChange={
                        (e) => {
                            setstateAct({
                                ...stateAct,
                                act: {
                                    ...stateAct.act,
                                    name: e.target.value,
                                }
                            })
                        }
                    }
                />
            </Box>
            <Box width="100%">
                <Typography gutterBottom>{t('price_of_act')}</Typography>
                <TextField placeholder={t('price_of_act')} fullWidth type="number" onChange={
                    (e) => {
                        setstateAct({
                            ...stateAct,
                            uuid: `${uniqueId()}`,
                            fees: +e.target.value as number,
                        })
                    }
                } />
            </Box>
        </AddActsDialogStyle>
    )
}

export default AddActsDialog