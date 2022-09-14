import React from 'react'
import { Typography, IconButton, Stack, Box, List, ListItem } from "@mui/material";
import RootStyled from './overrides/rootStyled';
import IconUrl from "@themes/urlIcon";
import Lable from '@themes/overrides/Lable'
function MotifTypeCard({ ...props }) {
    const { data, t } = props;
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
                <Typography variant={"subtitle2"} color="primary.main" className="title">
                    {data?.name}
                </Typography>
                <Stack direction='row' alignItems="center">
                    <List>
                        <ListItem sx={{ py: 0 }}>
                            {t('table.code')} : <Lable sx={{ ml: 1 }}>{data?.code}</Lable>
                        </ListItem>
                        <ListItem>
                            {t('table.icon')} : <IconUrl path={data.icon} />
                        </ListItem>
                    </List>
                    <Stack ml={'auto'} direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                        <IconButton size="small" sx={{ mr: { md: 1 } }}>
                            <IconUrl path="setting/edit" />
                        </IconButton>
                    </Stack>
                </Stack>
            </Box>

        </RootStyled>
    )
}

export default MotifTypeCard