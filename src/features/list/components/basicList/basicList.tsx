import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import BasicListStyled from "./overrides/basicListStyled";
import {Avatar, Button, Chip, ListItemAvatar, Typography, Stack} from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import {useSession} from "next-auth/react";

function BasicList({...props}) {
    const {data, handleAction, t, ...rest} = props;
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    return (
        <BasicListStyled {...rest}>
            <nav aria-label="main mailbox folders">
                <List>
                    {data.map((item: any, index: number) => (
                        <ListItem alignItems="flex-start" key={index}>
                            <ListItemAvatar>
                                <Avatar>
                                    <EventIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <Stack direction={"column"}>
                                <ListItemText primary={item.title}/>
                                <Stack direction={"row"} alignItems={"center"}>
                                    {item?.action !== "end-consultation" ? <span style={{display: "flex"}}>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.duration} <span className="dot"></span>
                                        </Typography>
                                        {t("online")}
                                    </span> : <Chip sx={{height: 26}}
                                                    color="primary"
                                                    label={`${item.appointment?.fees} ${devise}`}/>}

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
                        </ListItem>
                    ))}
                </List>
            </nav>
        </BasicListStyled>
    );
}

export default BasicList;
