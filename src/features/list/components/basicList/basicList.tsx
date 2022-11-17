import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import BasicListStyled from "./overrides/basicListStyled";
import {Avatar, Button, ListItemAvatar, Typography} from "@mui/material";
import EventIcon from '@mui/icons-material/Event';

function BasicList({...props}) {
    const {data, handleAction, ...rest} = props;

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
                            <ListItemText primary={item.title} secondary={
                                <React.Fragment>
                                    <span style={{display: "flex"}}>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.duration} <span className="dot"></span>
                                        </Typography>
                                        {"RDV en ligne"}
                                    </span>

                                    {item.buttons.map((button: any, index: number) => (
                                        <Button key={index} onClick={() => handleAction(button.action, item)}
                                                sx={{margin: 1}}
                                                variant="contained" color={button.color}
                                                size="small">{button.text}</Button>))
                                    }
                                </React.Fragment>
                            }/>

                        </ListItem>
                    ))}
                </List>
            </nav>
        </BasicListStyled>
    );
}

export default BasicList;
