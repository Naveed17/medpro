import AgendaPopupActionStyled from "./overrides/agendaPopupActionStyled";
import {
    Card,
    CardContent,
    List,
    ListItem,
    Typography,
    Stack,
    Avatar,
    Box,
    Link,
    Button
} from '@mui/material'
import IconUrl from "@themes/urlIcon";
import CheckIcon from '@mui/icons-material/Check';

function AgendaPopupAction({...props}) {
    const {data, onGerer, onConfirmer} = props
    return (
        <AgendaPopupActionStyled>
            <CardContent>
                <Typography gutterBottom variant="subtitle2" fontWeight={600}>
                    Une nouvelle demande de Rendez-vous !
                </Typography>
                <Card>
                    <List>
                        <ListItem>
                            <Stack spacing={1} direction='row' alignItems="flex-start">
                                <Avatar sx={{width: 24, height: 24}}/>
                                <Box>
                                    <Typography fontWeight={700} gutterBottom>
                                        {data.name}
                                    </Typography>
                                    <Stack spacing={0.2} direction='row' alignItems="center">
                                        <IconUrl path='ic-tel' className="ic-tel"/>
                                        <Link underline="none" href={`tel:`} sx={{ml: 1, fontSize: 12}}
                                              color="text.primary" fontWeight={400}>
                                            {data.phone}
                                        </Link>
                                    </Stack>
                                </Box>

                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Typography fontWeight={400}>
                                Date du rendez-vous
                            </Typography>
                            <Stack spacing={4} direction="row" alignItems='center'>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <IconUrl className='ic-callander' path="ic-calendar"/>
                                    <Typography fontWeight={600}>
                                        {data.date}
                                    </Typography>
                                </Stack>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <IconUrl className='ic-time' path="setting/ic-time"/>
                                    <Typography fontWeight={700}>
                                        {data.time}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </ListItem>
                    </List>
                </Card>
                <Stack mt={1} spacing={2} direction={{xs: 'column', md: "row"}}>
                    <Button fullWidth
                            onClick={onGerer}
                            variant="white" startIcon={<IconUrl path="ic-setting"/>}>
                        Gérer
                    </Button>
                    <Button
                        onClick={onConfirmer}
                        fullWidth
                        variant="contained" startIcon={<CheckIcon/>}>
                        Confirmer RDV
                    </Button>
                </Stack>
            </CardContent>
        </AgendaPopupActionStyled>
    )
}

export default AgendaPopupAction;
