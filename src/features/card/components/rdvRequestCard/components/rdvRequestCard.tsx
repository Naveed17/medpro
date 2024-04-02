import React from 'react'
import CardStyled from './overrides/cardStyle'
import { Avatar, CardContent, Stack, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import { ConditionalWrapper } from "@lib/hooks";
import Zoom from "react-medium-image-zoom";
import { CustomIconButton } from '@features/buttons';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
function RdvRequestCard() {
    return (
        <CardStyled>
            <CardContent>
                <Stack direction='row' alignItems='center'>
                    <IconUrl path="ic-alarm-sleep" width={23} height={23} />
                    <Stack spacing={.4} ml={1}>
                        <Typography color="primary" variant="body2" fontWeight={600}>
                            Nom du patient
                        </Typography>
                        <Stack direction='row' alignItems='center' spacing={.5}>
                            <IconUrl path="ic-agenda-jour" width={16} height={16} />
                            <Typography fontSize={10} fontWeight={500} variant="body2">
                                10/12/2022
                            </Typography>
                            <IconUrl path="ic-time" width={16} height={16} />
                            <Typography fontSize={10} fontWeight={500} variant="body2">
                                10:00
                            </Typography>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <ConditionalWrapper
                                condition={false}
                                wrapper={(children: any) => <Zoom>{children}</Zoom>}>
                                <Stack direction={"row"} alignItems={"center"} spacing={.3}>
                                    <Avatar
                                        src={"/static/icons/men-avatar.svg"}
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: .5
                                        }}>
                                        <IconUrl width={"16"} height={"16"} path="men-avatar" />
                                    </Avatar>
                                    <Typography fontSize={10} variant="body1" fontWeight={500} color="primary">
                                        Dr Ghassen BOULAHIA
                                    </Typography>
                                    <CircleIcon fontSize='small' sx={{ fontSize: 12 }} color='primary' />
                                    <Typography fontSize={10} fontWeight={500}>
                                        Endométriose
                                    </Typography>
                                </Stack>
                            </ConditionalWrapper>
                        </Stack>
                    </Stack>
                    <Stack ml="auto" direction='row' alignItems='center' spacing={.5} className='card-actions'>
                        <CustomIconButton color="primary" className="btn-close">
                            <CloseIcon fontSize='small' />
                        </CustomIconButton>
                        <CustomIconButton color="primary">
                            <DoneIcon fontSize='small' />
                        </CustomIconButton>
                    </Stack>
                </Stack>
            </CardContent>
        </CardStyled>
    )
}

export default RdvRequestCard