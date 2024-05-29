import React from 'react'
import ButtonSyled from './overrides/buttonStyle'
import Icon from '@themes/urlIcon'
import {useAppSelector, useAppDispatch} from '@lib/redux/hooks'
import {minMaxWindowSelector, setMinMaxWindowToggle} from '@features/buttons'

function MinMaxWindowButton({...props}) {
    const {isWindowMax} = useAppSelector(minMaxWindowSelector);
    const dispatch = useAppDispatch()
    const {sx} = props
    return (
        <ButtonSyled
            sx={{...sx}}
            onClick={() => dispatch(setMinMaxWindowToggle(isWindowMax))}>
            <Icon path='ic-minimize-square'/>
        </ButtonSyled>
    )
}

export default MinMaxWindowButton
