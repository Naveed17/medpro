import RootStyled from './overrides/rootStyled';
import {Avatar, Box, IconButton, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import CloseIcon from '@mui/icons-material/Close';

function PatientAppointmentCard({...props}) {
    const {item, listing, getData, ...rest} = props;
    console.log(item);
    return (
        <RootStyled
            disableRipple
            {...rest}
            {...{styleProps: listing?.toString()}}
            key={item.id}
        >
            <ListItemIcon>
                <Avatar {...(item.img !== null ? {src: item.img, alt: item.name, sx: {bgcolor: 'transparent'}} : {})} />
            </ListItemIcon>
            <Box>
                <Stack spacing={.5} direction="row" alignItems='center'>
                    <IconUrl path={item.gender === "male" ? "ic-h" : "ic-f"}/>
                    <Typography color="primary" sx={{fontWeight: 500, display: 'flex'}}>

                        {item.name}
                    </Typography>
                </Stack>
                <Stack spacing={.5} direction="row" alignItems='center'>
                    <IconUrl path="ic-anniverssaire"/>
                    <Typography color="text.secondary" variant="body2" sx={{fontWeight: 500, display: 'flex'}}>
                        {item.dob} - {item.ans}
                    </Typography>
                </Stack>
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
                <IconButton size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                getData(null);

                            }}
                >
                    <CloseIcon/>
                </IconButton>
            )
            }
        </RootStyled>
    )
}

export default PatientAppointmentCard;
