// components
import { Typography, ListItem, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Icon from "@themes/urlIcon";
import { useTranslation } from "next-i18next";
import { Theme } from "@mui/material/styles";
import React from "react";
import { upperFirst } from "lodash";
const list = [
    {
        heading: {
            title: "way of life",
            icon: "ic-doc",
        },
        sublist: ["alcohol", "tobacco", "add a way of life"],
    },
    {
        heading: {
            title: "background",
            icon: "ic-medicament",
        },
        sublist: [
            { text: "diabetes", icon: "ic-diabete" },
            { text: "hypertension", icon: "ic-cardio" },
            "add history",
        ],
    },
    {
        heading: {
            title: "allergies",
            icon: "ic-medicament",
        },
        sublist: ["add allergies"],
    },
];

const Content = () => {
    const { t, ready } = useTranslation('consultation', { keyPrefix: 'filter' });
    return (
        <React.Fragment>
            {list.map((list, j) =>
                <React.Fragment key={`list-${j}`}>
                    <Typography component="div" sx={{ "&::first-letter": { textTransform: "uppercase" }, display: 'flex', alignItems: 'center', '& .react-svg': { mr: 1.4 }, mt: j !== 0 ? 2 : 0 }} variant="body1" color="text.primary"><Icon path={list.heading.icon} />
                        {upperFirst(t(list.heading.title))}
                    </Typography>
                    <List sx={{ ml: 1 }}>
                        {list?.sublist.map((sub, k) =>
                            <ListItem disablePadding key={`sublist-${k}`}>
                                {list.sublist.length - 1 !== k ?
                                    <ListItemButton disableRipple sx={{ ':hover': { backgroundColor: 'transparent' }, p: 0, '& .react-svg svg': { width: 12, height: 12 } }}>
                                        {typeof sub === "object" ?
                                            <ListItemIcon sx={{ minWidth: '14px' }}>
                                                <Icon path={sub.icon} />
                                            </ListItemIcon>
                                            : null
                                        }
                                        <ListItemText sx={{ '& span': { fontSize: (theme: Theme) => theme.typography.caption, color: 'text.secondary' } }} primary={typeof sub === "object" ? upperFirst(t(sub.text)) : upperFirst(t(sub))} />
                                    </ListItemButton>
                                    : <ListItemButton disableRipple sx={{ ':hover': { backgroundColor: 'transparent' }, p: 0, '& .react-svg svg': { width: 12, height: 12, '& path': { fill: (theme: Theme) => theme.palette.primary.main } } }}>
                                        <ListItemIcon sx={{ minWidth: '14px' }}>
                                            <Icon path="ic-plus" />
                                        </ListItemIcon>
                                        <ListItemText sx={{ '& span': { fontSize: (theme: Theme) => theme.typography.caption }, color: (theme: Theme) => theme.palette.primary.main }} primary={typeof sub === "object" ? upperFirst(t(sub.text)) : upperFirst(t(sub))} />
                                    </ListItemButton>
                                }
                            </ListItem>
                        )}

                    </List>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}
export default Content


