import RootStyled from './overrides/rootStyled';
import {Avatar, Box, IconButton, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import CloseIcon from '@mui/icons-material/Close';
import moment from "moment-timezone";

function PatientAppointmentCard({...props}) {
    const {item, listing, onReset, ...rest} = props;

    return (
        <RootStyled
            disableRipple
            {...rest}
            {...{styleprops: listing?.toString()}}
        >
            <ListItemIcon key={item.uuid}>
                <Avatar key={item.uuid}
                        src={`/static/icons/${item.gender !== "O" ? "men" : "women"}-avatar.svg`}
                        alt={item.name}/>
            </ListItemIcon>
            <Box>
                <Stack spacing={.5} direction="row" alignItems='center'>
                    <Typography color="primary" sx={{fontWeight: 500, display: 'flex'}}>
                        {item.firstName} {item.lastName}
                    </Typography>
                </Stack>
                {item.birthdate && <Stack spacing={.5} direction="row" alignItems='center'>
                    <IconUrl path="ic-anniverssaire"/>
                    <Typography color="text.secondary" variant="body2" sx={{fontWeight: 500, display: 'flex'}}>
                        {item.birthdate} - {moment().diff(moment(item.birthdate, "DD-MM-YYYY"), 'years')} ans
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
                <IconButton size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onReset(null);
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
