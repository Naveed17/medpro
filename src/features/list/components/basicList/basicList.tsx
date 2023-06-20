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

function BasicList({...props}) {
    const {data, handleAction, t, ...rest} = props;
    const {data: session} = useSession();
    const theme = useTheme();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    return (
        <BasicListStyled {...rest}>
            <List>
                {data.map((item: any, index: number) => (
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
                                <ListItemText sx={{"& .MuiTypography-root": {fontSize: 12}}} primary={item.title}/>
                                <Stack direction={item?.action !== "end-consultation" ? "column" : "row"}
                                       alignItems={item?.action !== "end-consultation" ? "flex-start" : "center"}>
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
                                    </span> : item.appointment?.fees > 0 && <Chip sx={{height: 26}}
                                                                                  color="primary"
                                                                                  label={`${item.appointment?.fees} ${devise}`}/>}

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
