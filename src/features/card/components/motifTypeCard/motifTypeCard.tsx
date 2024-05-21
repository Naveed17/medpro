import React from 'react'
import {Typography, IconButton, Box, List, ListItem, ListItemIcon, useTheme, Stack} from "@mui/material";
import RootStyled from './overrides/rootStyled';
import IconUrl from "@themes/urlIcon";
import {IconsTypes} from "@features/calendar";
import {ModelDot} from "@features/modelDot";
import Can from "@features/casl/can";

function MotifTypeCard({...props}) {
    const {data, t, handleDrawer} = props;
    const theme = useTheme();

    return (
        <RootStyled
            sx={{
                "&:before": {
                    bgcolor: data?.color,
                    width: ".4rem"
                },
            }}>
            <Box className="card-main">
                <List>
                    <ListItem sx={{px: 0}}>
                        <ModelDot
                            icon={IconsTypes[data.icon]}
                            color={data.color}
                            selected={false}
                            {...(theme.direction === "rtl" && {
                                style: {
                                    marginLeft: 8
                                }
                            })}
                            marginRight={theme.direction === "rtl" ? 0 : 15}></ModelDot>
                        <Typography variant={"subtitle2"} color="primary.main" className="title">
                            {data?.name}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} ml={"auto"}>
                            <Can I={"manage"} a={"settings"} field={"settings__consultation-type__update"}>
                                <IconButton
                                    size="small"
                                    className="btn-edit"
                                    sx={{mr: {md: 1}}}
                                    onClick={() => handleDrawer(data, "edit")}>
                                    <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                                </IconButton>
                            </Can>
                            <Can I={"manage"} a={"settings"} field={"settings__consultation-type__delete"}>
                                {!data.hasData && <IconButton
                                    size="small"
                                    sx={{
                                        mr: {md: 1},
                                        '& .react-svg svg': {
                                            width: 20,
                                            height: 20
                                        }
                                    }}
                                    onClick={() => handleDrawer(data, "delete")}>
                                    <IconUrl color={theme.palette.text.secondary} path="ic-trash"/>
                                </IconButton>}
                            </Can>
                        </Stack>

                    </ListItem>
                </List>
            </Box>
        </RootStyled>
    )
}

export default MotifTypeCard
