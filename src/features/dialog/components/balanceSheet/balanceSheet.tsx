import {
    Grid,
    Stack,
    Typography,
    Button,
    Card,
    IconButton,
    TextField, ListItemButton, ListItemText, List, ListItem, Skeleton,
    Menu, MenuItem, Box
} from '@mui/material'
import { useFormik, Form, FormikProvider } from "formik";
import BalanceSheetDialogStyled from './overrides/balanceSheetDialogStyle';
import { useTranslation } from 'next-i18next'
import AddIcon from '@mui/icons-material/Add';
import Icon from '@themes/urlIcon'
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useRequest, useRequestMutation } from "@app/axios";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
function MedicalPrescriptionDialog({ ...props }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { data } = props;
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const formik = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: async (values) => {
            if (name.length > 0)
                addAnalysis({ uuid: '', name })
        },
    });

    const router = useRouter();
    const { data: session } = useSession();
    const { data: httpAnalysisResponse } = useRequest({
        method: "GET",
        url: "/api/private/analysis/" + router.locale,
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    });
    const [analysisList, setAnalysisList] = useState<AnalysisModel[]>([]);
    const [analysis, setAnalysis] = useState<AnalysisModel[]>(data.state);
    const { trigger } = useRequestMutation(null, "/balanceSheet");
    const [name, setName] = useState('');

    const addAnalysis = (value: AnalysisModel) => {
        setName('')
        analysis.push(value)
        setAnalysis([...analysis])
        data.setState([...analysis])
    }

    const handleChange = (ev: any) => {
        setName(ev.target.value);

        if (ev.target.value.length > 2) {
            trigger({
                method: "GET",
                url: "/api/private/analysis/" + router.locale + '?name=' + ev.target.value,
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }).then((r) => {
                setAnalysisList((r?.data as HttpResponse).data)
            })
        } else
            setAnalysisList((httpAnalysisResponse as HttpResponse)?.data);
    }

    useEffect(() => {
        setAnalysisList((httpAnalysisResponse as HttpResponse)?.data);
    }, [httpAnalysisResponse])

    const {
        handleSubmit,
        getFieldProps
    } = formik;

    if (!ready) return <>loading translations...</>;
    return (
        <BalanceSheetDialogStyled>
            <Grid container spacing={5}>
                <Grid item xs={12} md={7}>
                    <FormikProvider value={formik}>
                        <Stack
                            spacing={2}
                            component={Form}
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}>
                            <Stack spacing={1}>
                                <Stack direction="row" alignItems="center">
                                    <Typography>{t('please_name_the_balance_sheet')}</Typography>
                                    <Button
                                        sx={{ ml: 'auto' }}
                                        endIcon={
                                            <KeyboardArrowDownIcon />
                                        }
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        {t('balance_sheet_model')}
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        sx={{
                                            '& .MuiPaper-root': {
                                                borderRadius: 0,
                                                borderBottomLeftRadius: 8,
                                                borderBottomRightRadius: 8,
                                                marginTop: theme => theme.spacing(1),
                                                minWidth: 150,
                                                backgroundColor: theme => theme.palette.text.primary

                                            }
                                        }}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        {
                                            ['antibody_assessment', "blood_glucose", "AMH"].map((item, idx) =>
                                                <MenuItem key={idx} sx={{ color: theme => theme.palette.grey[0] }} onClick={handleClose}>{t(item)}</MenuItem>

                                            )
                                        }



                                    </Menu>
                                </Stack>
                                <TextField
                                    id="balance_sheet_name"
                                    value={name}
                                    placeholder={t('placeholder_balance_sheet_name')}
                                    onChange={handleChange} />
                            </Stack>
                            <Button className='btn-add' type={"submit"} size='small'
                                startIcon={
                                    <AddIcon />
                                }>
                                {t('add_balance_sheet')}
                            </Button>
                            {
                                analysisList?.length > 0 &&
                                <List className='items-list'>
                                    {
                                        analysisList?.map(anaylis => (
                                            <ListItemButton key={anaylis.uuid} onClick={() => {
                                                addAnalysis(anaylis)
                                            }}>
                                                <ListItemText primary={anaylis.name} />
                                            </ListItemButton>
                                        )
                                        )
                                    }
                                </List>
                            }
                        </Stack>
                    </FormikProvider>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Stack direction="row" alignItems="center">
                        <Typography gutterBottom>{t('balance_sheet_list')}</Typography>
                        <Button className='btn-add'
                            sx={{ ml: 'auto' }}
                            startIcon={
                                <AddIcon />
                            }>
                            {t('save_template')}
                        </Button>
                    </Stack>
                    <Box className="list-container">
                        {
                            analysis.length > 0 ?
                                analysis.map((item, index) => (
                                    <Card key={index}>
                                        <Stack p={1} direction='row' alignItems="center" justifyContent='space-between'>
                                            <Typography>{item.name}</Typography>
                                            <IconButton size="small">
                                                <Icon path="setting/icdelete" />
                                            </IconButton>
                                        </Stack>
                                    </Card>
                                ))
                                : <Card className='loading-card'>
                                    <Stack spacing={2}>
                                        <Typography alignSelf="center">
                                            {t("list_empty")}
                                        </Typography>
                                        <List>
                                            {
                                                Array.from({ length: 4 }).map((_, idx) =>
                                                    <ListItem key={idx} sx={{ py: .5 }}>
                                                        <Skeleton width={10} height={8} variant="rectangular" />
                                                        <Skeleton sx={{ ml: 1 }} width={130} height={8} variant="rectangular" />
                                                    </ListItem>
                                                )
                                            }

                                        </List>
                                    </Stack>
                                </Card>
                        }
                    </Box>
                </Grid>
            </Grid>
        </BalanceSheetDialogStyled>
    )
}

export default MedicalPrescriptionDialog