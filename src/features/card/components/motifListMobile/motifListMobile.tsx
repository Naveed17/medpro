import { Typography, IconButton, Stack, Box, Select, Switch, MenuItem, SelectChangeEvent, List, ListItem, Grid } from "@mui/material";
import RootStyled from './overrides/rootStyled';
import IconUrl from "@themes/urlIcon";
import Lable from '@themes/overrides/Lable'
import { useState } from 'react'
function MotifListMobile({ ...props }) {
    const { data, t } = props;
    console.log(data)
    const [state, setstate] = useState<any>({
        duration: `${data?.duration}`,
        min: `${data?.minimumDelay}`,
        max: `${data?.maximumDelay}`,
    });
    const handleChange = (event: SelectChangeEvent) => {
        setstate({
            ...state,
            [event.target.name]: event.target.value as string
        })
    };
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
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Typography gutterBottom variant="body2" fontWeight={500}>
                            {t("duration")}
                        </Typography>
                        <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id={"dur"}
                            name="duration"
                            size="small"
                            onChange={handleChange}
                            value={state.duration}
                            displayEmpty={true}
                            sx={{ color: "text.secondary" }}
                            renderValue={(value) =>
                                value?.length
                                    ? Array.isArray(value)
                                        ? value.join(", ")
                                        : value
                                    : t("duration")
                            }
                        >
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom variant="body2" fontWeight={500}>
                            {t("delay_min")}
                        </Typography>
                        <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id={"min"}
                            name="min"
                            size="small"
                            onChange={handleChange}
                            value={state.min}
                            displayEmpty={true}
                            sx={{ color: "text.secondary" }}
                            renderValue={(value) =>
                                value?.length
                                    ? Array.isArray(value)
                                        ? value.join(", ")
                                        : value
                                    : t("delay_min")
                            }
                        >
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom variant="body2" fontWeight={500}>
                            {t("delay_max")}
                        </Typography>
                        <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id={"max"}
                            name="max"
                            size="small"
                            onChange={handleChange}
                            value={state.max}
                            displayEmpty={true}
                            sx={{ color: "text.secondary" }}
                            renderValue={(value) =>
                                value?.length
                                    ? Array.isArray(value)
                                        ? value.join(", ")
                                        : value
                                    : t("delay_max")
                            }
                        >
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                <Stack direction='row' alignItems="center">
                    <List>
                        <ListItem sx={{ py: 0 }}>
                            {t('agenda')} : <Lable sx={{ ml: 1 }}>{data?.agenda?.length}</Lable>
                        </ListItem>
                        <ListItem>
                            {t('type')} :<Lable sx={{ ml: 1 }}>{data?.types?.length}</Lable>
                        </ListItem>
                    </List>
                    <Stack ml={'auto'} direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                        <Switch name='active' checked={data.isEnabled} />
                        <IconButton size="small" sx={{ mr: { md: 1 } }}>
                            <IconUrl path="setting/edit" />
                        </IconButton>
                    </Stack>
                </Stack>
            </Box>

        </RootStyled>
    )
}

export default MotifListMobile;
