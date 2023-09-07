import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import BasicListStyled from "./overrides/basicListStyled";
import {Avatar, Button, Chip, ListItemAvatar, Typography, Stack, ListItemButton, useTheme} from "@mui/material";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import {useSession} from "next-auth/react";
import {NotifBadgeStyled} from "@features/popover";
import {ConditionalWrapper} from "@lib/hooks";
import NotesIcon from '@mui/icons-material/Notes';
import {useState} from "react";

function BasicList({...props}) {
    const {data, handleAction, t, ...rest} = props;
    const {data: session} = useSession();
    const theme = useTheme();

    const [dataItems] = useState(data.reverse());
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    return (
        <BasicListStyled {...rest}>
            <List sx={{maxHeight: 300, overflow: 'auto'}}>
                {dataItems.map((item: any, index: number) => (
                    <ListItemButton selected={!item.appointment?.edited} key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <ConditionalWrapper
                                    condition={!item.appointment?.edited}
                                    wrapper={(children: any) => <NotifBadgeStyled
                                        overlap="circular"
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                        variant="dot">{children}</NotifBadgeStyled>}>
                                    <Avatar sx={{bgcolor: theme.palette.text.secondary}}>
                                        {item.avatar}
                                    </Avatar>
                                </ConditionalWrapper>
                            </ListItemAvatar>
                            <Stack direction={"column"}>
                                <ListItemText sx={{"& .MuiTypography-root": {fontSize: 12}}} primary={<>
                                    {item.title}
                                    {item.appointment?.fees > 0 && <Chip size={"small"}
                                                                         sx={{
                                                                             height: 16,
                                                                             ml: 1,
                                                                             fontSize: 10,
                                                                             padding: 0
                                                                         }}
                                                                         color="secondary"
                                                                         label={`${item.appointment?.fees} ${devise}`}/>}
                                </>}/>
                                {item.appointment?.instruction?.length > 0 && <Stack direction={"row"}>
                                    <NotesIcon sx={{fontSize: 20}}/>
                                    <Typography
                                        variant={"body2"}>{`${item.appointment.control ? `${t("next-appointment-control")} ${item.appointment.nextApp} ${t("times.days")} \r\n` : ""}, ${item.appointment.instruction}`}
                                    </Typography>
                                </Stack>}
                                <Stack direction={item?.action !== "end-consultation" ? "column" : "row"}
                                       alignItems={item?.action !== "end-consultation" ? "flex-start" : "center"}>
                                    {item?.action !== "end-consultation" && <span style={{display: "flex"}}>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.duration} <span className="dot"></span>
                                        </Typography>
                                        <Typography variant={"body2"}> {t("online")}</Typography>
                                    </span>}


                                    <Stack direction={"row"}>
                                        {item.buttons?.map((button: any, index: number) => (
                                            <Button key={index}
                                                    onClick={() => handleAction(button.action, item)}
                                                    sx={{margin: 1}}
                                                    {...(button.href && {href: button.href})}
                                                    variant="contained" color={button.color}
                                                    size="small">{button.text}</Button>))
                                        }
                                    </Stack>
                                </Stack>
                            </Stack>
                        </ListItem>
                    </ListItemButton>

                ))}
            </List>
        </BasicListStyled>
    );
}

export default BasicList;
