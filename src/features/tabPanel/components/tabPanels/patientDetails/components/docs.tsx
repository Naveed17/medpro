import React from 'react'
import RootStyled from './overrides/rootStyle'
import {
    Badge,
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    InputAdornment,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material'
import {CustomIconButton} from '@features/buttons'
import IconUrl from '@themes/urlIcon'
import {a11yProps} from '@lib/hooks'
import Image from "next/image";

function Docs({...props}) {
    const {t, theme} = props;
    const [currentTab, setCurrentTab] = React.useState(0);
    const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
    return (
        <RootStyled className='docs-panel'>
            <Card>

                <CardHeader
                    title={<Typography variant='subtitle1' fontWeight={600}>
                        {t("patient_documents")}
                    </Typography>}
                    action={
                        <CustomIconButton color="primary">
                            <IconUrl path="ic-plus" width={16} height={16} color={theme.palette.common.white}/>
                        </CustomIconButton>

                    }
                />
                <CardContent>
                    <Stack spacing={2}>
                        <Tabs
                            variant="scrollable"
                            scrollButtons="auto"
                            className='custom-tabs' value={currentTab} onChange={handleTabsChange}
                            aria-label="patients tabs">
                            {["medical_doc", "personal_doc"].map((title: string, tabHeaderIndex: number) =>
                                <Tab key={`tabHeaderIndex-${tabHeaderIndex}`}
                                     icon={
                                         <Badge badgeContent={4}
                                                color={tabHeaderIndex === currentTab ? "primary" : "info"}>
                                             <Box/>
                                         </Badge>}

                                     iconPosition='end'
                                     label={t("tabs." + title)} {...a11yProps(tabHeaderIndex)} />)}
                        </Tabs>
                        <Stack direction='row' spacing={1} width={1}>
                            <TextField
                                placeholder={t("search")}
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <IconUrl path="ic-search"/>
                                    </InputAdornment>,
                                }}/>
                            <CustomIconButton>
                                <IconUrl path="ic-outline-filter"/>
                            </CustomIconButton>
                        </Stack>
                    </Stack>
                    <Stack display='grid'
                           sx={{
                               gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                               gap: 2,
                               mt: 3
                           }}>
                        <Card className='doc-card'>
                            <CardMedia
                                component={Box}>
                                <IconUrl path="ic-folder" width={34} height={34}/>
                            </CardMedia>
                            <CardContent>
                                <Stack spacing={.5}>
                                    <Typography fontWeight={500}>
                                        Default
                                    </Typography>
                                    <Typography variant='caption' color={theme.palette.grey[500]}>
                                        21 files
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card className='doc-card'>
                            <CardMedia
                                component={Box}>
                                <IconUrl path="folder-open" width={34} height={34}/>
                            </CardMedia>
                            <CardContent>
                                <Stack spacing={.5}>
                                    <Typography fontWeight={500}>
                                        Archive
                                    </Typography>
                                    <Typography variant='caption' color={theme.palette.grey[500]}>
                                        21 files
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card className='doc-card'>
                            <CardMedia
                                component={Box}>
                                <Image alt="rapport" src="/static/img/rapport.png"/>
                            </CardMedia>
                            <CardContent>
                                <Stack spacing={.5}>
                                    <Typography fontWeight={500}>
                                        Rapport
                                    </Typography>
                                    <Typography variant='caption' color={theme.palette.grey[500]}>
                                        1.2 Mb
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </CardContent>
            </Card>
        </RootStyled>
    )
}

export default Docs
