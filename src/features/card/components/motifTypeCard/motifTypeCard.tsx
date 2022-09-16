import React from 'react'
import { Typography, IconButton, Stack, Box, List, ListItem, ListItemIcon } from "@mui/material";
import RootStyled from './overrides/rootStyled';
import IconUrl from "@themes/urlIcon";
function MotifTypeCard({ ...props }) {
    const { data, t, handleDrawer } = props;
    return (
        <RootStyled
            sx={{
                "&:before": {
                    bgcolor: data?.color,
                    width: ".4rem"
                },
            }}
        >

            <Box className="card-main">
                <List>
                    <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                            <IconUrl path={data.icon} />
                        </ListItemIcon>
                        <Typography variant={"subtitle2"} color="primary.main" className="title">
                            {data?.name}
                        </Typography>
                        <IconButton size="small" sx={{ ml: 'auto' }} onClick={() => handleDrawer(data)}>
                            <IconUrl path="setting/edit" />
                        </IconButton>
                    </ListItem>
                </List>
            </Box>
        </RootStyled>
    )
}

export default MotifTypeCard