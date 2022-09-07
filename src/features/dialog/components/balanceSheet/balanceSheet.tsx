import {
    Grid,
    Stack,
    Typography,
    Button,
    Card,
    IconButton,
    TextField, ListItemButton, ListItemText
} from '@mui/material'
import {useFormik, Form, FormikProvider} from "formik";
import BalanceSheetDialogStyled from './overrides/balanceSheetDialogStyle';
import {useTranslation} from 'next-i18next'
import AddIcon from '@mui/icons-material/Add';
import Icon from '@themes/urlIcon'
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";

function MedicalPrescriptionDialog({...props}) {
    console.log(props)
    const {data} = props;
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const formik = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: async (values) => {
            if (name.length > 0)
                addAnalysis({uuid: '', name})
        },
    });

    const router = useRouter();
    const {data: session} = useSession();
    const {data: httpAnalysisResponse} = useRequest({
        method: "GET",
        url: "/api/private/analysis/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });
    const [analysisList, setAnalysisList] = useState<AnalysisModel[]>([]);
    const [analysis, setAnalysis] = useState<AnalysisModel[]>(data.state);
    const {trigger} = useRequestMutation(null, "/balanceSheet");
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
                headers: {Authorization: `Bearer ${session?.accessToken}`}
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
                                <Typography>{t('please_name_the_balance_sheet')}</Typography>

                                <TextField
                                    id="balance_sheet_name"
                                    value={name}
                                    placeholder={t('placeholder_balance_sheet_name')}
                                    onChange={handleChange}/>
                            </Stack>
                            <Button className='btn-add' type={"submit"} size='small'
                                    startIcon={
                                        <AddIcon/>
                                    }>
                                {t('add_balance_sheet')}
                            </Button>

                            {analysisList &&
                                analysisList.map(anaylis => (
                                        <ListItemButton key={anaylis.uuid} onClick={() => {
                                            addAnalysis(anaylis)
                                        }}>
                                            <ListItemText primary={anaylis.name}/>
                                        </ListItemButton>
                                    )
                                )
                            }

                        </Stack>
                    </FormikProvider>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Typography gutterBottom>{t('balance_sheet_list')}</Typography>
                    {
                        analysis.map((item, index) => (
                            <Card key={index}>
                                <Stack p={1} direction='row' alignItems="center" justifyContent='space-between'>
                                    <Typography>{item.name}</Typography>
                                    <IconButton size="small">
                                        <Icon path="setting/icdelete"/>
                                    </IconButton>
                                </Stack>
                            </Card>
                        ))}
                </Grid>
            </Grid>
        </BalanceSheetDialogStyled>
    )
}

export default MedicalPrescriptionDialog