import RootStyled from './overrides/rootStyled';
import {Avatar, Box, IconButton, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import CloseIcon from '@mui/icons-material/Close';
import moment from "moment-timezone";
import Icon from "@themes/urlIcon";
import React from "react";

function PatientAppointmentCard({...props}) {
    const {item: patient, listing, onReset, onEdit, ...rest} = props;

    return (
        <RootStyled
            disableRipple
            {...rest}
            {...{styleprops: listing?.toString()}}
        >
            <ListItemIcon key={patient.uuid}>
                <Avatar key={patient.uuid}
                        src={`/static/icons/${patient.gender !== "O" ? "men" : "women"}-avatar.svg`}
                        alt={patient.name}/>
            </ListItemIcon>
            <Box>
                <Stack spacing={.5} direction="row" alignItems='center'>
                    <Typography color="primary" sx={{fontWeight: 500, display: 'flex'}}>
                        {patient.firstName} {patient.lastName}
                    </Typography>
                </Stack>
                {patient.birthdate && <Stack spacing={.5} direction="row" alignItems='center'>
                    <IconUrl path="ic-anniverssaire"/>
                    <Typography color="text.secondary" variant="body2" sx={{fontWeight: 500, display: 'flex'}}>
                        {patient.birthdate} - {moment().diff(moment(patient.birthdate, "DD-MM-YYYY"), 'years')} ans
                    </Typography>
                </Stack>}
            </Box>
            <ListItemText>
                <Typography
                    variant="subtitle1"
                    color="text.primary"
                    noWrap
                >
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                </Typography>
            </ListItemText>
            {listing && (
                <>
                    <IconButton
                        size="small"
                        sx={{mr: 1}}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(patient);
                        }}
                    >
                        <Icon color={"white"} path="setting/edit"/>
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onReset(null);
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </>
            )}
        </RootStyled>
    )
}

export default PatientAppointmentCard;
